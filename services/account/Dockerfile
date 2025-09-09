FROM node:20-alpine3.22@sha256:820e86612c21d0636580206d802a726f2595366e1b867e564cbc652024151e8a

RUN mkdir -p /usr/app && chown -R 1000:1000 /usr/app
RUN mkdir -p /usr/app/database && chown -R 1000:1000 /usr/app/database


RUN apk add --no-cache sqlite

COPY ./tools/account.sh /usr/local/bin/ 

COPY ./database /usr/app/database/ 

RUN chmod +x /usr/local/bin/account.sh

WORKDIR /usr/app

EXPOSE 1414

ENTRYPOINT ["/usr/app/database/createDB.sh"]
CMD ["account.sh"]