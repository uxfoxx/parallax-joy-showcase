#!/usr/bin/env bash
#
# Deploy the Olive Foods site to the VPS.
#
# Builds locally, ships the build as a NEW timestamped release, flips a symlink,
# and reloads that project's own pm2 process. Nothing here touches the other two
# projects sharing this box.
#
#   Server layout .............. /srv/olivefoods/releases/<timestamp>/   the builds
#                                /srv/olivefoods/current -> releases/…   what is served
#                                /srv/olivefoods/server/                 sirv runtime
#                                /srv/olivefoods/nginx.conf              staged vhost
#   First-time server setup .... deploy/SERVER_SETUP.md
#   Config ..................... cp deploy/deploy.conf.example deploy/deploy.conf
#                                then fill it in (deploy.conf is gitignored).
#
# Why releases + symlink rather than rsync straight into the live directory:
# the old script did `rsync --delete` into the docroot, so mid-deploy visitors
# got 404s on assets and a failed transfer left a broken site with no way back.
# Now the running site is untouched until a single symlink flip, and the
# previous release stays on disk for an instant rollback.
#
# Usage:  ./scripts/deploy.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

CONF="$ROOT/deploy/deploy.conf"
if [[ -f "$CONF" ]]; then
  # shellcheck disable=SC1090
  source "$CONF"
else
  echo "✗  Missing deploy/deploy.conf. Copy deploy/deploy.conf.example to" >&2
  echo "   deploy/deploy.conf and fill in your VPS details first." >&2
  exit 1
fi

: "${DEPLOY_HOST:?Set DEPLOY_HOST in deploy/deploy.conf (your VPS IP or hostname)}"
DEPLOY_USER="${DEPLOY_USER:-deploy}"
DEPLOY_PATH="${DEPLOY_PATH:-/srv/olivefoods}"
DEPLOY_SSH_PORT="${DEPLOY_SSH_PORT:-22}"
APP_NAME="${APP_NAME:-olivefoods}"
SITE_URL="${SITE_URL:-https://www.olivefoods.lk}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"

SSH=(ssh -p "$DEPLOY_SSH_PORT" "${DEPLOY_USER}@${DEPLOY_HOST}")
RSYNC_E="ssh -p ${DEPLOY_SSH_PORT}"
# pm2 and node live in the deploy user's nvm, which a non-interactive ssh does
# not source. Every remote command that needs them gets this prelude.
NVM='export NVM_DIR=$HOME/.nvm; . $NVM_DIR/nvm.sh >/dev/null 2>&1;'

RELEASE="$(date +%Y%m%d-%H%M%S)"

echo "▶  Installing dependencies…"
npm ci

echo "▶  Building…"
npm run build

if [[ ! -f "$ROOT/dist/index.html" || ! -f "$ROOT/dist/200.html" ]]; then
  echo "✗  Build produced no dist/index.html or dist/200.html — aborting deploy." >&2
  echo "   (200.html is the SPA shell sirv falls back to; without it every" >&2
  echo "    client-side route would 404.)" >&2
  exit 1
fi

echo "▶  Uploading release ${RELEASE}…"
"${SSH[@]}" "mkdir -p ${DEPLOY_PATH}/releases/${RELEASE} ${DEPLOY_PATH}/server ${DEPLOY_PATH}/shared/logs"
# --delete is safe here: the target is a brand new empty directory, not the
# live site.
rsync -az --delete -e "$RSYNC_E" \
  "$ROOT/dist/" "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/releases/${RELEASE}/"

echo "▶  Syncing runtime + config…"
rsync -az -e "$RSYNC_E" \
  "$ROOT/deploy/server/package.json" "$ROOT/deploy/server/package-lock.json" \
  "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/server/"
rsync -az -e "$RSYNC_E" \
  "$ROOT/deploy/ecosystem.config.cjs" "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"
rsync -az -e "$RSYNC_E" \
  "$ROOT/deploy/nginx-olivefoods.conf" "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/nginx.conf"

echo "▶  Installing server runtime (sirv)…"
"${SSH[@]}" "${NVM} cd ${DEPLOY_PATH}/server && npm ci --omit=dev --silent"

echo "▶  Activating release…"
# ln -sfn is unlink-then-symlink, so there is a window where `current` does not
# exist. Creating a temp link and mv -T'ing it over is a genuine atomic rename.
"${SSH[@]}" "cd ${DEPLOY_PATH} && ln -sfn releases/${RELEASE} .current.tmp && mv -Tf .current.tmp current"

echo "▶  Reloading ${APP_NAME}…"
# sirv builds its file manifest at startup, so the symlink flip alone would keep
# serving the previous release's file list. The reload is mandatory, not tidiness.
"${SSH[@]}" "${NVM} cd ${DEPLOY_PATH} && (pm2 reload ${APP_NAME} --update-env || pm2 start ecosystem.config.cjs) && pm2 save --force" >/dev/null

echo "▶  Applying nginx config…"
"${SSH[@]}" "sudo /usr/local/sbin/reload-site-nginx ${APP_NAME}"

echo "▶  Smoke testing ${SITE_URL}…"
sleep 2
CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "${SITE_URL}/" || echo 000)"
if [[ "$CODE" != "200" ]]; then
  echo "✗  Smoke test failed (HTTP ${CODE}). Rolling back to the previous release." >&2
  PREV="$("${SSH[@]}" "ls -1 ${DEPLOY_PATH}/releases | sort | tail -2 | head -1")"
  if [[ -n "$PREV" && "$PREV" != "$RELEASE" ]]; then
    "${SSH[@]}" "cd ${DEPLOY_PATH} && ln -sfn releases/${PREV} .current.tmp && mv -Tf .current.tmp current"
    "${SSH[@]}" "${NVM} pm2 reload ${APP_NAME}" >/dev/null
    echo "   Rolled back to ${PREV}." >&2
  fi
  exit 1
fi

echo "▶  Pruning old releases (keeping ${KEEP_RELEASES})…"
"${SSH[@]}" "cd ${DEPLOY_PATH}/releases && ls -1 | sort -r | tail -n +$((KEEP_RELEASES+1)) | xargs -r rm -rf"

echo "✓  Deployed ${RELEASE} → ${SITE_URL}"
