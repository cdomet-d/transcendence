#!/bin/sh
#genlog.sh

mkdir -p ./_log

docker compose log nginx >./_log/nginx.log
docker compose log frontend >./_log/frontend.log