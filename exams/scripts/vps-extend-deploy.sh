#!/usr/bin/env bash
# Teaches the existing 1 minute deploy cron to rebuild the exams app too.
#
#   bash /var/www/windchasers/exams/scripts/vps-extend-deploy.sh
#
# /usr/local/bin/wc-deploy.sh currently pulls origin/main and rebuilds only the
# main site, so without this a push updates the repository while pm2 keeps
# serving the old exams build. Idempotent, it will not append twice.

set -euo pipefail

DEPLOY=/usr/local/bin/wc-deploy.sh
MARKER="# --- exams app ---"

if [ ! -f "$DEPLOY" ]; then
  echo "FAIL: $DEPLOY not found. Find the deploy script with:"
  echo "  crontab -l; ls /usr/local/bin"
  exit 1
fi

cp "$DEPLOY" "$DEPLOY.bak.$(date +%Y%m%d%H%M%S)"
echo "backed up to $DEPLOY.bak.*"

if grep -q "$MARKER" "$DEPLOY"; then
  echo "already extended, nothing to do"
  exit 0
fi

cat >> "$DEPLOY" <<'BLOCK'

# --- exams app ---
# Rebuild exams.windchasers.in whenever main moves. Runs inside the same flock
# guard as the main site. A failure here must not abort the main deploy, so the
# block is tolerant and only restarts pm2 on a successful build.
if [ -d /var/www/windchasers/exams ]; then
  cd /var/www/windchasers/exams
  npm ci --no-audit --no-fund
  rm -rf .next
  if npm run build; then
    pm2 restart windchasers-exams --update-env \
      || pm2 start /var/www/windchasers/exams/ecosystem.config.js
    pm2 save
  else
    echo "exams build failed, keeping the previous build running" >&2
  fi
  cd /var/www/windchasers
fi
BLOCK

echo "appended the exams block to $DEPLOY"
echo
echo "tail of the file:"
tail -20 "$DEPLOY"
