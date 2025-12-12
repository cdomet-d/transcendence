#!/bin/bash

host=$(echo "$SESSION_MANAGER" | cut -b 7-12)

if [ -n "$host" ]; then 
	echo "HOST=$host" > ./services/game-manager/game-manager.env
else
	echo "HOST=localhost" > ./services/game-manager/game-manager.env
fi

echo "NGINXIP=nginx" >> ./services/game-manager/game-manager.env
echo "NATS_SERVER_TOKEN=${NATS_SERVER_TOKEN}" >> ./services/game-manager/game-manager.env
echo "JWT_SECRET=${JWT_SECRET}" >> ./services/game-manager/game-manager.env