FROM node:20-alpine3.22

RUN mkdir -p /usr/src/app && chown -R 1000:1000 /usr/src/app

WORKDIR /usr/src/app

# COPY ./js ./

#COPY webSocketServer/server.js ./
#COPY webSocketServer/package.json ./
# a la place copier le dossier entier et utiliser dockerignore pour les dossiers/fichiers qu'on veut pas copier
#RUN npm ou pnpm install -> looks at the dependencies in package.json and installs them all

COPY webSocketServer ./
RUN npm install

EXPOSE 2020

CMD ["node", "webSocketServer/server.js"]