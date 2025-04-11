#!/bin/sh

echo "BASE_URL: $BASE_URL"
echo "BROKER_URL: $BROKER_URL"
echo "SECRET_KEY: $SECRET_KEY"
echo "DOMAIN_NAME: $DOMAIN_NAME"
sed -i "s|\${BASE_URL}|${BASE_URL}|g" /usr/share/nginx/html/assets/env.js
sed -i "s|\${BROKER_URL}|${BROKER_URL}|g" /usr/share/nginx/html/assets/env.js
sed -i "s|\${SECRET_KEY}|${SECRET_KEY}|g" /usr/share/nginx/html/assets/env.js
sed -i "s|\${DOMAIN_NAME}|${DOMAIN_NAME}|g" /usr/share/nginx/html/assets/env.js
exec "$@"
