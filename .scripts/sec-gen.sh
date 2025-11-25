#!/bin/bash

set -x

mkdir -p .secrets/
cd .secrets || echo 'cd failed!' exit 1;

openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 3650 -nodes -subj "/C=XX/CN=localhost"
