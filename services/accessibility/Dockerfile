FROM node:20-alpine3.22@sha256:a8560b36e8b8210634f77d9f7f9efd7ffa463e380b75e2e74aff4511df3ef88c

RUN mkdir -p /usr/app && chown -R 1000:1000 /usr/app

WORKDIR /usr/app

COPY tools/access.sh /usr/local/bin/ 

RUN chmod +x /usr/local/bin/access.sh

EXPOSE 1313

CMD ["access.sh"]
