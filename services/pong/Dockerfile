FROM node:20-alpine3.22@sha256:820e86612c21d0636580206d802a726f2595366e1b867e564cbc652024151e8a

RUN mkdir -p /usr/app && chown -R 1000:1000 /usr/app

WORKDIR /usr/app

COPY tools/pong.sh /usr/local/bin/ 

RUN chmod +x /usr/local/bin/pong.sh

EXPOSE 2020

# --------------- NATS
WORKDIR /app

RUN npm install nats dotenv

COPY ./entrypoint/subscriber.js ./

ENTRYPOINT [ "node", "subscriber.js" ]
# --------------- NATS

CMD ["pong.sh"]
