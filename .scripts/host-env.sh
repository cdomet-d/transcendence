#!/bin/bash

host=$(echo "$SESSION_MANAGER" | cut -b 7-12)

if [ -n "$host" ]; then 
	echo "HOST=$host" >> .env
else
	echo "HOST=localhost" >> .env
fi