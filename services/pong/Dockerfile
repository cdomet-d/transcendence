FROM node:20-alpine3.22

RUN mkdir -p /usr/src/app && chown -R 1000:1000 /usr/src/app

WORKDIR /usr/src/app

# COPY ./js ./

RUN mkdir /usr/src/.script

COPY script/empty-logs.sh /usr/local/bin/ 

RUN chmod +x /usr/local/bin/empty-logs.sh

ENTRYPOINT ["empty-logs.sh"]

EXPOSE 2020

CMD ["node", "--env-file=.env", "server.js"]
# CMD ["node", "listener.js"]