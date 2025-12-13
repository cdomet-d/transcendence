FROM node:20-alpine3.22@sha256:820e86612c21d0636580206d802a726f2595366e1b867e564cbc652024151e8a

RUN mkdir -p /usr/app && chown -R 1000:1000 /usr/app

WORKDIR /usr/app

COPY ./tools /usr/local/bin/ 

RUN chmod +x /usr/local/bin/friends.sh

RUN chmod +x /usr/local/bin/createDB.sh

RUN apk update && apk add --no-cache sqlite

EXPOSE 1616

ENTRYPOINT ["/usr/local/bin/createDB.sh"]

CMD ["friends.sh"]