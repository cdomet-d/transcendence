FROM node:alpine3.22@sha256:820e86612c21d0636580206d802a726f2595366e1b867e564cbc652024151e8a

RUN mkdir -p /usr/src/app && chown -R 1000:1000 /usr/src/app

WORKDIR /usr/src/app

COPY ./web/package*.json ./

RUN npm install

EXPOSE 1212

# Vite default port
EXPOSE 5173

CMD ["node", "listener.js"]