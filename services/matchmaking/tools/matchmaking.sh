#!/bin/sh

> /usr/app/server.log

npm install

npm run dev | tee nats.log
#npm start
