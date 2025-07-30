FROM node:alpine3.22@sha256:820e86612c21d0636580206d802a726f2595366e1b867e564cbc652024151e8a

RUN mkdir -p /usr/src/app && chown -R 1000:1000 /usr/src/app

COPY ./js /usr/src/app

WORKDIR /usr/src/app

#RUN npm ou pnpm init -> creates package.json
#RUN npm ou pnpm i fastify -> installs fastify module

EXPOSE 2020

CMD ["node", "webSocketServer/server.js"]