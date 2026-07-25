# Deploying Olive Foods to a Namecheap VPS (AlmaLinux 9)

One-time setup for a **fresh AlmaLinux 9 (64-bit) VPS**, serving the site at
**https://olivefoods.lk**. After this, every deploy is a single command from
your Mac: `./scripts/deploy.sh`.

The site is a static build — nginx just serves files. No Node, no database, and
no secrets live on the server.

> **On Ubuntu/Debian instead?** Swap `dnf`→`apt`, `firewalld`→`ufw`, the wheel
> group→sudo, put the site config in `/etc/nginx/sites-available/` + symlink,
> and skip the SELinux step. Ask and I'll give you that variant.

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

DNS can take minutes to a few hours. Check from your Mac until it returns
`<VPS_IP>`:

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
dnf upgrade -y
dnf install -y rsync   # needed for deploys; minimal images often lack it
```

---

## Step 2 — Create a deploy user (so you're not deploying as root)

On AlmaLinux the sudo group is **wheel**:

```bash
adduser deploy
passwd deploy                 # set a password when prompted
usermod -aG wheel deploy
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

## Step 3 — Install nginx + open the firewall  *(back on the server as root)*

```bash
dnf install -y nginx
systemctl enable --now nginx

firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

---

## Step 4 — Create the web root (with the right SELinux context)

AlmaLinux runs **SELinux in enforcing mode**. nginx can only serve a directory
labelled `httpd_sys_content_t`, and `/var/www` isn't labelled that by default —
skip this and you'll get **403 Forbidden**.

```bash
mkdir -p /var/www/olivefoods
chown -R deploy:deploy /var/www/olivefoods

dnf install -y policycoreutils-python-utils
semanage fcontext -a -t httpd_sys_content_t "/var/www/olivefoods(/.*)?"
restorecon -Rv /var/www/olivefoods
```

---

## Step 5 — Install the site config

On AlmaLinux, site configs live in `/etc/nginx/conf.d/`. Copy
`deploy/nginx-olivefoods.conf` from this repo onto the server — **from your Mac**:

```bash
scp deploy/nginx-olivefoods.conf root@<VPS_IP>:/etc/nginx/conf.d/olivefoods.conf
```

Then **on the server**:

```bash
nginx -t                  # test config
systemctl reload nginx
```

> Optional: the stock `/etc/nginx/nginx.conf` has a default `server {}` block that
> shows the "Welcome to nginx" page when someone hits the raw IP. Name-based
> routing still sends `olivefoods.lk` to our config, so you can leave it. To hide
> the default page entirely, comment out that `server { … }` block in
> `nginx.conf` and reload.

---

## Step 6 — Enable HTTPS (free, auto-renewing)

Only works once DNS from Step 0 resolves to the VPS. certbot comes from EPEL:

```bash
dnf install -y epel-release
dnf install -y certbot python3-certbot-nginx
certbot --nginx -d olivefoods.lk -d www.olivefoods.lk
```

Choose **redirect HTTP → HTTPS** when asked. certbot edits the nginx config,
installs the certificate, and enables auto-renewal (verify with
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

---

## Troubleshooting

- **403 Forbidden** — almost always SELinux. Re-run
  `restorecon -Rv /var/www/olivefoods` on the server. Confirm files are labelled
  with `ls -Z /var/www/olivefoods` (you want `httpd_sys_content_t`). New files
  from `rsync` inherit the directory's label, so this normally only bites if
  Step 4 was skipped.
- **404 on a sub-route** (e.g. `/about` works from the menu but 404s on refresh)
  — the SPA fallback isn't active; check `/etc/nginx/conf.d/olivefoods.conf` has
  the `try_files $uri $uri/ /index.html;` line and reload nginx.
- **certbot fails** — DNS isn't pointing at the VPS yet (`dig +short
  olivefoods.lk` must return `<VPS_IP>`), or ports 80/443 aren't open in
  firewalld (Step 3).
