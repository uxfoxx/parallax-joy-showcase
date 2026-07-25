#!/usr/bin/env bash
#
# Manual deploy for the Olive Foods site.
# Builds the site locally, then syncs the static dist/ folder to the VPS
# over SSH + rsync. No Node/database runs on the server — it just serves files.
#
#   First-time server setup .... deploy/SERVER_SETUP.md
#   Config ..................... cp deploy/deploy.conf.example deploy/deploy.conf
#                                then fill it in (deploy.conf is gitignored).
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
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/olivefoods}"
DEPLOY_SSH_PORT="${DEPLOY_SSH_PORT:-22}"

echo "▶  Installing dependencies…"
npm ci

echo "▶  Building…"
npm run build

if [[ ! -f "$ROOT/dist/index.html" ]]; then
  echo "✗  Build produced no dist/index.html — aborting deploy." >&2
  exit 1
fi

echo "▶  Syncing dist/ → ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"
# --delete removes stale files on the server so it mirrors dist/ exactly.
rsync -avz --delete \
  -e "ssh -p ${DEPLOY_SSH_PORT}" \
  "$ROOT/dist/" \
  "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo "✓  Deployed → https://olivefoods.lk"
