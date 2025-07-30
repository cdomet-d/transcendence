FROM node:alpine3.22@sha256:820e86612c21d0636580206d802a726f2595366e1b867e564cbc652024151e8a

RUN npm install -g typescript

RUN mkdir -p /usr/src/app/src && chown -R 1000:1000 /usr/src/app

#COPY ./js /usr/src/app
COPY ./src /usr/src/app/
COPY tsconfig.json /usr/src/app
COPY package.json /usr/src/app


WORKDIR /usr/src/app
RUN npm install --save-dev @types/node
RUN npm run dev

EXPOSE 1212

CMD ["npm", "run", "dev"]