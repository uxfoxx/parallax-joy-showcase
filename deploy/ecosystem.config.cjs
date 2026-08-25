// pm2 process definition for the Olive Foods site on the VPS.
//
// The site is a static Vite/React build. It used to be served by nginx reading
// /var/www/olivefoods directly; it now runs as its own pm2 process on its own
// loopback port so that each project on this shared box has an independent
// runtime that can be restarted, capped and reasoned about on its own.
//
// Division of responsibility: sirv serves bytes, nginx owns HTTP policy
// (caching, CSP, security headers). That is why no --maxage/--immutable flags
// appear here -- nginx sets Cache-Control per location and hides sirv's copy.
//
// `current` is a symlink into releases/<timestamp>. sirv builds its file
// manifest at startup, so flipping the symlink is NOT enough on its own --
// scripts/deploy.sh always follows the flip with `pm2 reload olivefoods`.
module.exports = {
  apps: [
    {
      name: "olivefoods",
      namespace: "olivefoods",
      cwd: __dirname,
      script: "server/node_modules/sirv-cli/bin.js",
      args: "current --single 200.html --etag --host 127.0.0.1 --port 4001",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      // Static file serving on a 957MB box with two other projects. If this
      // ever climbs past 150M something is wrong; restart rather than let the
      // OOM killer pick a victim from another project.
      max_memory_restart: "150M",
      env: { NODE_ENV: "production" },
      error_file: "shared/logs/pm2-error.log",
      out_file: "shared/logs/pm2-out.log",
      time: true,
    },
  ],
};
