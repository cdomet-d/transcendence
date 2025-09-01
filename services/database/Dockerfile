FROM node:alpine3.22@sha256:820e86612c21d0636580206d802a726f2595366e1b867e564cbc652024151e8a

RUN mkdir -p /usr/src/app && chown -R 1000:1000 /usr/src/app

RUN apk update && apk add --no-cache sqlite

WORKDIR /usr/src/app

#COPY ./js /usr/src/app
COPY init_db.sql /usr/src/init_db.sql
COPY creatingDB.sh /usr/src/app

RUN chmod +x /usr/src/app/creatingDB.sh

ENTRYPOINT ["/usr/src/app/creatingDB.sh"]
CMD ["tail", "-f", "/dev/null"]
