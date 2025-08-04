#!/bin/sh
#genlog.sh

mkdir -p ./_logs

docker compose logs nginx >./_logs/check-nginx.log