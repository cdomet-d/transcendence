FROM node:20-alpine3.22

RUN mkdir -p /usr/src/app && chown -R 1000:1000 /usr/src/app

WORKDIR /usr/src/app

COPY ./js ./

# COPY webSocketServer ./
RUN npm install

EXPOSE 2020

# CMD ["node", "--env-file=.env", "server.js"]
CMD ["node", "listener.js"]