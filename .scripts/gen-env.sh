#!/bin/bash

set -euo pipefail

path_to_self=$(pwd)/"$( dirname -- "${BASH_SOURCE[0]}" )"
path_to_repository_root=$(dirname "$path_to_self")
path_to_env="$path_to_repository_root"/".env"
if [ ! -f "$path_to_env" ]; then
	echo "[ERROR] .env file not found, creating it..."
	touch "$path_to_env"
else
	echo "[INFO] found .env file at $path_to_repository_root/.env"
fi

echo "[INFO] setting hostname environnement variable"
bash "$path_to_self/host-env.sh" || echo "[ERROR]: $path_to_self/host-env.sh failed"

echo "[INFO] creating SSL certificates at $path_to_repository_root/.secrets"
bash "$path_to_self/sec-gen.sh" || echo "[ERROR]: $path_to_self/sec-gen.sh failed"

echo "[INFO] setting TSECRETS environnement variable"
echo "TSECRETS=$path_to_repository_root/.secrets" >> "$path_to_env"

echo "[INFO] Generating random values for JWT_SECRET and NATS_SERVER_TOKEN variables"
echo "JWT_SECRET=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 35)" >> "$path_to_env"
echo "NATS_SERVER_TOKEN=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 35)" >> "$path_to_env"
