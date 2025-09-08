FROM node:alpine3.22@sha256:820e86612c21d0636580206d802a726f2595366e1b867e564cbc652024151e8a

RUN mkdir -p /usr/src/app && chown -R 1000:1000 /usr/src/app

RUN mkdir -p /usr/src/database && chown -R 1000:1000 /usr/src/database

RUN apk add --no-cache sqlite

COPY ./database /usr/src/database

COPY ./js /usr/src/app

WORKDIR /usr/src/app

EXPOSE 1313

ENTRYPOINT ["/usr/src/database/createDB.sh"]
CMD ["node", "listener.js"]