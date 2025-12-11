#!/bin/bash

host=$(echo "$SESSION_MANAGER" | cut -b 7-12)

if [ -n "$host" ]; then 
	echo "HOST=$host" > ./services/frontend/frontend.env
else
	echo "HOST=localhost" > ./services/frontend/frontend.env
fi

echo "NGINXIP=nginx" >> ./services/frontend/frontend.env
echo "NATS_SERVER_TOKEN=${NATS_SERVER_TOKEN}" >> ./services/frontend/frontend.env