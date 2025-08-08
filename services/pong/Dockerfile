FROM node:20-alpine3.22

RUN mkdir -p /usr/src/app && chown -R 1000:1000 /usr/src/app

WORKDIR /usr/src/app

RUN mkdir /usr/src/.script

COPY script/pong.sh /usr/local/bin/ 

RUN chmod +x /usr/local/bin/pong.sh

EXPOSE 2020

CMD ["pong.sh"]
