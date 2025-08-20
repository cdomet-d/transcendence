FROM node:alpine3.22@sha256:820e86612c21d0636580206d802a726f2595366e1b867e564cbc652024151e8a

RUN mkdir -p /app && chown -R 1000:1000 /app

WORKDIR /app

COPY ./web/package.json ./web/package-lock.json ./
COPY ./web/vite.config.ts ./web/tsconfig.json ./web/index.html ./web/listener.js ./
COPY ./web/src/ src/
COPY ./web/public/ public/

RUN npm install

EXPOSE 5173

CMD ["npx", "vite"]
