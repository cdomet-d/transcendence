#!/bin/sh

> /usr/app/server.log

npm install

# npx @tailwindcss/cli -i ./static/style-src.css -o ./static/style-dist.css
# npx tsc

npm run dev
//npm start
