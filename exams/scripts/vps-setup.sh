#!/usr/bin/env bash
# One time VPS setup for exams.windchasers.in on the windchasers box
# (srv1187504, 72.61.237.244). Run as root or with sudo.
#
#   bash /var/www/windchasers/exams/scripts/vps-setup.sh
#
# Safe to run more than once. It stops before requesting a certificate if DNS
# is not yet pointing here, since certbot fails and rate limits on a bad domain.

set -euo pipefail

APP_DIR=/var/www/windchasers/exams
DOMAIN=exams.windchasers.in
PORT=3002
EXPECTED_IP=$(curl -fsS -m 10 https://api.ipify.org || echo "unknown")

say() { printf '\n=== %s ===\n' "$1"; }

say "1. Repository"
cd /var/www/windchasers
git fetch origin main
git reset --hard origin/main
if [ ! -d "$APP_DIR" ]; then
  echo "FAIL: $APP_DIR missing. The push may not have landed yet."
  exit 1
fi
echo "exams/ present at $(git log --oneline -1)"

say "2. Environment file"
if [ ! -f "$APP_DIR/.env.local" ]; then
  echo "Creating $APP_DIR/.env.local from the main site's values."
  # The exams app shares the main site's Supabase project, so the three
  # Supabase values are copied straight across.
  grep -E '^(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)=' \
    /var/www/windchasers/.env.local > "$APP_DIR/.env.local"
  echo "NEXT_PUBLIC_SITE_URL=https://$DOMAIN" >> "$APP_DIR/.env.local"
  chmod 600 "$APP_DIR/.env.local"
fi
echo "keys present:"
sed -n 's/=.*//p' "$APP_DIR/.env.local" | sed 's/^/  /'

say "3. Port check"
if ss -ltnp 2>/dev/null | grep -q ":$PORT "; then
  echo "WARNING: something is already listening on $PORT:"
  ss -ltnp | grep ":$PORT "
  echo "The exams app expects $PORT to itself. Resolve before continuing."
else
  echo "port $PORT is free"
fi

say "4. Build"
cd "$APP_DIR"
npm ci
rm -rf .next
npm run build

say "5. PM2"
pm2 delete windchasers-exams 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 list | grep -E "windchasers|name" || true

say "6. Local smoke test"
sleep 3
code=$(curl -s -o /dev/null -w '%{http_code}' -m 15 "http://127.0.0.1:$PORT/login" || echo 000)
echo "http://127.0.0.1:$PORT/login -> $code"
if [ "$code" != "200" ]; then
  echo "FAIL: app is not serving locally. Check: pm2 logs windchasers-exams --lines 50"
  exit 1
fi

say "7. Nginx"
cp "$APP_DIR/nginx.conf" "/etc/nginx/sites-available/$DOMAIN"
ln -sfn "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
nginx -t
systemctl reload nginx
echo "nginx reloaded"

say "8. DNS check before certbot"
resolved=$(getent hosts "$DOMAIN" | awk '{print $1}' | head -1 || true)
echo "this server: $EXPECTED_IP"
echo "$DOMAIN resolves to: ${resolved:-nothing}"
if [ -z "$resolved" ]; then
  echo
  echo "DNS is not pointing here yet. Add this record, wait for it to"
  echo "propagate, then run:  certbot --nginx -d $DOMAIN"
  echo
  echo "   Type A   Name exams   Value $EXPECTED_IP   TTL 300"
  echo
  echo "Everything else is done. The app is live over plain HTTP once DNS lands."
  exit 0
fi

say "9. Certificate"
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --redirect \
  -m admin@windchasers.in || {
    echo "certbot failed. Re-run manually once DNS has propagated:"
    echo "  certbot --nginx -d $DOMAIN"
    exit 1
  }

say "Done"
echo "https://$DOMAIN should now be live."
echo "Logs: pm2 logs windchasers-exams"
