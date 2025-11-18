#!/bin/sh

> /usr/app/server.log

npm install -s

npm run dev | tee .log