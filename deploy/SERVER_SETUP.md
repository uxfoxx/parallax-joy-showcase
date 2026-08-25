# Olive Foods on the shared VPS — how it runs, and how to rebuild it

**This is not a from-scratch runbook any more.** The site is live and this
document describes the arrangement it actually runs under, so that the setup can
be understood, rebuilt, or moved. For day-to-day work you only need:

```bash
./scripts/deploy.sh
```

> **Rewritten 2026-08-19.** The previous version described a static nginx setup
> serving `/var/www/olivefoods` directly, with the site config hand-installed on
> the server. That is no longer how this works, and following it would produce a
> broken deploy.

---

## The shared box

`159.198.45.242`, AlmaLinux 9, 1 vCPU / ~1 GB RAM / 2 GB swap. **Two other
projects run on it** (MiniFlix and Bandit Theory). They are deliberately isolated
— separate process, port, vhost, directory, logs and memory cap each. Anything
you do must stay in this project's lane.

| | |
|---|---|
| Directory | `/srv/olivefoods/` |
| Runtime port | **4001**, bound to `127.0.0.1` only |
| pm2 app | `olivefoods` (namespace `olivefoods`) |
| nginx vhost | `/etc/nginx/conf.d/10-olivefoods.conf` |
| Logs | `/var/log/nginx/olivefoods.{access,error}.log`, `pm2 logs olivefoods` |

Ports come from a registry so a new project cannot collide: **4001** olivefoods ·
**4002** miniflix · **4003** bandittheory. Next one takes 4004. Never 3000 — it is
the default for Next.js, Express and TanStack Start.

## How a page gets served

```
browser → nginx :443 (TLS, caching, security headers)
        → 127.0.0.1:4001  sirv, serving /srv/olivefoods/current/
```

The build is a static Vite/React bundle plus 30 prerendered HTML pages. It is
served by **sirv** (a small production static server) running under pm2, not by
nginx reading files directly, so this project has its own restartable runtime like
the other two.

**nginx still owns HTTP policy** — caching, security headers, gzip. sirv only
serves bytes, and its `Cache-Control` is hidden and replaced per location. That is
why `deploy/ecosystem.config.cjs` passes no `--maxage`/`--immutable` flags.

## Directory layout

```
/srv/olivefoods/
├── releases/<timestamp>/    each deploy, 5 kept
├── current -> releases/…    the symlink sirv serves
├── server/                  sirv runtime (npm ci'd from deploy/server/)
├── shared/logs/             pm2 stdout/stderr
├── ecosystem.config.cjs     pm2 process definition
└── nginx.conf               staged vhost, installed by the helper below
```

## What `./scripts/deploy.sh` does

1. `npm ci` and `npm run build` **locally** — the VPS OOMs on `vite build`.
   The build includes sitemap generation and Puppeteer prerendering.
2. Uploads to a **new** `releases/<timestamp>/` — the running site is untouched.
3. Flips `current` with an atomic `mv -T` rename.
4. `pm2 reload olivefoods`. **This is mandatory, not tidiness:** sirv builds its
   file manifest at startup, so a symlink flip alone would keep serving the old
   release's file list.
5. Installs this project's nginx config, smoke-tests the live URL, and **rolls
   back to the previous release automatically if it fails**.
6. Prunes to the newest 5 releases.

Manual rollback is a symlink flip plus a reload:

```bash
ssh deploy@159.198.45.242 'ls /srv/olivefoods/releases'
ssh deploy@159.198.45.242 'cd /srv/olivefoods && ln -sfn releases/<older> .current.tmp && mv -Tf .current.tmp current'
ssh deploy@159.198.45.242 'export NVM_DIR=$HOME/.nvm; . $NVM_DIR/nvm.sh; pm2 reload olivefoods'
```

## nginx config

`deploy/nginx-olivefoods.conf` in this repo is the **source of truth**.
`deploy.sh` stages it to `/srv/olivefoods/nginx.conf` and runs
`sudo /usr/local/sbin/reload-site-nginx olivefoods` — a root-owned helper that
installs it, runs `nginx -t`, and **restores the previous file if the test fails**.

**Never hand-edit `/etc/nginx/conf.d/`.** The server copy had drifted 29 lines
from this repo and there was no way to tell which was live.

Two things in that file are load-bearing and easy to break:

- **`.mjs` must be served as JavaScript.** nginx's `mime.types` does not map it,
  which is what broke the pdf.js brochure worker. sirv gets this right; the nginx
  block only adds caching.
- **`add_header` is not inherited** into a location that declares its own. Every
  security header is repeated per location on purpose.

## TLS

Let's Encrypt via certbot, **webroot** authenticator against the shared
`/var/www/acme`, with a `renew_hook` that reloads nginx — so renewals never
rewrite vhost files. Auto-renews via `certbot-renew.timer`.

> ⚠️ **Renewal for this cert currently FAILS.** The cert covers both
> `www.olivefoods.lk` and bare `olivefoods.lk`, and Let's Encrypt validates every
> name. Bare `olivefoods.lk` still has **two A records** — the VPS and a dead
> Bluehost IP `50.87.216.108` — so validation hits the dead one and 404s. **The
> cert expires 2026-10-29.** Fix: remove the stale `@` A record at the **LK Domain
> Registry (nic.lk)**. Keep the `mail` record on 50.87.216.108 — that is email.

## Access

The `deploy` user is **not** an admin. It can write its own project directories
and run exactly two privileged things: the nginx helper above and
`systemctl restart pm2-deploy`. It previously held `NOPASSWD:ALL`, which meant a
compromise of any one of the three projects was a root compromise of all of them.
Real admin work uses the separate root SSH key.

## Rebuilding this from scratch

If the box were lost, the order is: install nginx + Node/pm2 → create `deploy`
(non-admin, key-only) → `/srv/olivefoods` skeleton owned by `deploy` →
`conf.d/00-default.conf` catch-all **first** (without it, whichever vhost loads
first becomes the default for the whole server) → shared snippets → certbot
webroot → then `./scripts/deploy.sh` does everything else.

## Troubleshooting

```bash
# is the app up and where it should be?
ssh deploy@159.198.45.242 'ss -ltn | grep 4001'      # expect 127.0.0.1:4001
ssh deploy@159.198.45.242 'export NVM_DIR=$HOME/.nvm; . $NVM_DIR/nvm.sh; pm2 list'
ssh deploy@159.198.45.242 'export NVM_DIR=$HOME/.nvm; . $NVM_DIR/nvm.sh; pm2 logs olivefoods --lines 50'

# this site's own traffic and errors, not the other two projects'
ssh deploy@159.198.45.242 'sudo tail -f /var/log/nginx/olivefoods.error.log'
```

If the site 502s, sirv is down — `pm2 list` will show it stopped or restarting.
If it serves stale content after a deploy, the `pm2 reload` did not run.
