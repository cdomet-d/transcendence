FROM nats:2.11.8-alpine3.22@sha256:e7ecc3cf81f4ccada9d24f8466d157ff472c20a12a5f8dddaeb26d71e7b42ee1

COPY ./conf/nats.conf /etc/nats/nats.conf

EXPOSE 4222

CMD ["--config", "/etc/nats/nats.conf"]
