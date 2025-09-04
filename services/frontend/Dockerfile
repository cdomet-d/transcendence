FROM node:20-alpine3.22@sha256:820e86612c21d0636580206d802a726f2595366e1b867e564cbc652024151e8a

RUN mkdir -p /app && chown -R 1000:1000 /app

WORKDIR /app

EXPOSE 1212

COPY ./tools/front.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/front.sh

CMD ["front.sh"]
