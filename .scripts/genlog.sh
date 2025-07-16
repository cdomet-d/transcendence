#!/bin/sh
#genlog.sh

mkdir -p ./logs

docker compose logs nginx >./logs/check-nginx.log