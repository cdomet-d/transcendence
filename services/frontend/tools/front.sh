#!/bin/sh

> ../web/server.log

npm install

# npx @tailwindcss/cli -i ./static/style-src.css -o ./static/style-dist.css

# npx tsc

npm start
