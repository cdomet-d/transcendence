FROM node:20-alpine3.22@sha256:820e86612c21d0636580206d802a726f2595366e1b867e564cbc652024151e8a

RUN mkdir -p /usr/app && chown -R 1000:1000 /usr/app

WORKDIR /usr/app

COPY tools/lobby.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/lobby.sh

EXPOSE 2222

CMD ["lobby.sh"]
