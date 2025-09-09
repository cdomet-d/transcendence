FROM node:20-alpine3.22@sha256:820e86612c21d0636580206d802a726f2595366e1b867e564cbc652024151e8a

RUN mkdir -p /usr/src/app && chown -R 1000:1000 /usr/src/app

COPY ./tools /usr/local/bin/ 

RUN chmod +x /usr/local/bin/friends.sh

RUN apk add --no-cache sqlite


COPY ./js /usr/src/app

WORKDIR /usr/src/app

EXPOSE 1616

ENTRYPOINT ["/usr/local/bin/createDB.sh"]
CMD ["node", "listener.js"]
#CMD ["friends.sh"]
