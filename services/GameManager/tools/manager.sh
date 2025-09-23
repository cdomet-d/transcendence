#!/bin/sh

> /usr/app/server.log

npm install

npm run dev | tee LOGS