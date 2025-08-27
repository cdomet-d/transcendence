FROM nats:2.11.8-alpine3.22

COPY ./conf/nats.conf /etc/nats/nats.conf

EXPOSE 4222

CMD ["--config", "/etc/nats/nats.conf"]
