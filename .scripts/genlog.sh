#!/bin/sh
#genlog.sh

mkdir -p ./_logs

docker compose logs nginx >./_logs/nginx.log
docker compose logs frontend >./_logs/frontend.log