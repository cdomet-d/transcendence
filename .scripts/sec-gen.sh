#!/bin/bash

set -x

mkdir -p .secrets/
cd .secrets || echo 'cd failed!' exit 1;

# Generate our own CA (Certificate Authority) key.
openssl genrsa -out root.key 4096

# Uses that key to generate the certificate authority .cert file
openssl req -x509 -new -nodes -key root.key -sha256 -days 3650 -out root.crt -subj "/CN=BigT"

curdir="$(pwd)/../services/*/"

for dir in $curdir; do
	serviceName=$(basename "$dir")
	# Generates the service's private key
	openssl genrsa -out "$serviceName".key 2048

	# Creates a CSR - certificate signin request - for the service. 
	# It will be used on the next line to generate the service's certificate
	openssl req -new -key "$serviceName".key -out "$serviceName".csr -subj "/CN=$serviceName"

	# Uses the previously generated .csr file to request the rootCA 
	openssl x509 -req -in "$serviceName".csr -CA root.crt -CAkey root.key -CAcreateserial \
    -out "$serviceName".crt -days 365 -sha256
done

rm ./*.csr