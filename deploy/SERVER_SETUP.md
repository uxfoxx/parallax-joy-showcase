# Deploying Olive Foods to a Namecheap VPS

One-time setup for a **fresh Ubuntu 22.04/24.04 VPS**, serving the site at
**https://olivefoods.lk**. After this, every deploy is a single command from
your Mac: `./scripts/deploy.sh`.

The site is a static build — nginx just serves files. No Node, no database, and
no secrets live on the server.

> **AlmaLinux/CentOS VPS instead of Ubuntu?** The steps are identical in spirit,
> but swap `apt` → `dnf`, and use `firewalld` instead of `ufw`. Ask if you took
> that image and I'll give you the exact commands.

Throughout, replace `<VPS_IP>` with your server's IP (in the Namecheap VPS
welcome email).

---

## Step 0 — Point the domain at the VPS  *(do this first — HTTPS needs it)*

In Namecheap: **Domain List → olivefoods.lk → Manage → Advanced DNS**. Set two
A records (delete any old ones pointing at the previous host):

| Type     | Host  | Value       | TTL       |
|----------|-------|-------------|-----------|
| A Record | `@`   | `<VPS_IP>`  | Automatic |
| A Record | `www` | `<VPS_IP>`  | Automatic |

DNS can take anywhere from minutes to a few hours. Check from your Mac until it
returns `<VPS_IP>`:

```bash
dig +short olivefoods.lk
```

> ⚠️ This moves the live site off your current Namecheap shared hosting onto the
> VPS. Only continue once you're ready for that switch.

---

## Step 1 — Connect and update

```bash
ssh root@<VPS_IP>
```

```bash
apt update && apt upgrade -y
```

---

## Step 2 — Create a deploy user (so you're not deploying as root)

```bash
adduser deploy            # set a password when prompted
usermod -aG sudo deploy
```

Then set up **key-based login** so `deploy.sh` can rsync without a password.
Run this part **on your Mac**, in a new terminal:

```bash
# create a key if you don't already have one (press Enter through the prompts)
[ -f ~/.ssh/id_ed25519.pub ] || ssh-keygen -t ed25519

# install it on the server for the deploy user (uses the password you just set)
ssh-copy-id deploy@<VPS_IP>
```

Confirm it works passwordlessly:

```bash
ssh deploy@<VPS_IP> "echo connected as \$(whoami)"
```

---

## Step 3 — Install nginx + firewall  *(back on the server as root)*

```bash
apt install -y nginx
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

---

## Step 4 — Create the web root

```bash
mkdir -p /var/www/olivefoods
chown -R deploy:deploy /var/www/olivefoods
```

---

## Step 5 — Install the site config

Copy `deploy/nginx-olivefoods.conf` from this repo onto the server. Easiest way,
**from your Mac**:

```bash
scp deploy/nginx-olivefoods.conf root@<VPS_IP>:/etc/nginx/sites-available/olivefoods
```

Then **on the server**:

```bash
ln -s /etc/nginx/sites-available/olivefoods /etc/nginx/sites-enabled/olivefoods
rm -f /etc/nginx/sites-enabled/default    # drop the "Welcome to nginx" default
nginx -t                                  # test config
systemctl reload nginx
```

---

## Step 6 — Enable HTTPS (free, auto-renewing)

Only works once DNS from Step 0 resolves to the VPS.

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d olivefoods.lk -d www.olivefoods.lk
```

Choose **redirect HTTP → HTTPS** when asked. certbot edits the nginx config,
installs the certificate, and sets up automatic renewal (verify with
`systemctl list-timers | grep certbot`).

---

## Step 7 — First deploy  *(from your Mac, in the repo)*

```bash
cp deploy/deploy.conf.example deploy/deploy.conf
```

Edit `deploy/deploy.conf` — set `DEPLOY_HOST="<VPS_IP>"` (the other defaults are
already correct). Then:

```bash
./scripts/deploy.sh
```

It builds the site and rsyncs it to the server. Open **https://olivefoods.lk** —
you're live.

---

## Every deploy after that

```bash
./scripts/deploy.sh
```

That's the whole workflow: it rebuilds and syncs. No FTP, no GitHub secrets, no
server logins needed for routine updates.
