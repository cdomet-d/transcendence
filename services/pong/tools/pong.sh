#!/bin/sh

> /usr/app/server.log

npm install -s

# npx @tailwindcss/cli -i ./static/style-src.css -o ./static/style-dist.css
# npx tsc

npm run dev 
#| tee nats.log
#npm start
