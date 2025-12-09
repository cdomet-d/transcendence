#!/bin/bash

host=$(echo "$SESSION_MANAGER" | cut -b 7-12)

if [ -n "$host" ]; then 
	echo "PUBLIC_IP=$host" > ../services/nginx/nginx.env
	echo "PUBLIC_IP=$host" > ../services/frontend/frontend.env
fi