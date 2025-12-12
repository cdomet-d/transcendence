#!/bin/bash

mkdir -p .secrets/
cd .secrets || echo 'cd failed!' exit 1;

host=$(echo "$SESSION_MANAGER" | cut -b 7-22)

if [ -n "$host" ]; then 
	openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 3650 -nodes -subj "/C=XX/CN=$host" || exit 1
	echo "Created secrets for $host"
	exit 0
else
	echo "Could not recover hostname, defaulting to localhost"
	openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 3650 -nodes -subj "/C=XX/CN=localhost" || exit 1
	exit 1
fi


