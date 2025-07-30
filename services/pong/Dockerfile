FROM node:alpine3.22@sha256:820e86612c21d0636580206d802a726f2595366e1b867e564cbc652024151e8a

RUN mkdir -p /usr/src/app && chown -R 1000:1000 /usr/src/app

WORKDIR /usr/src/app

COPY ./js ./

#COPY webSocketServer/server.js ./
#COPY webSocketServer/package.json ./
# a la place copier le dossier entier et utiliser dockerignore pour les dossiers/fichiers qu'on veut pas copier
#RUN npm ou pnpm install -> looks at the dependencies in package.json and installs them all

EXPOSE 2020

CMD ["node", "js/listener.js"]