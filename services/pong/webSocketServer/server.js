'use strict'

import Fastify from 'fastify'
import fs from 'fs/promises';
import websocket from '@fastify/websocket'
import path from 'path'
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';

const port = process.env.PORT;
//"node --env-file=.env server.js"

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

/* creer le server */
function checkProxy(address, hop) {
  if (address === '127.0.0.1'/*adresse nginx*/ || hop === 1)
    return true;
  return false;
}

const options = {
  logger: true,
  // https: true,
  // trustProxy: checkProxy
  //connectionTimeout
  //forceCloseConnections
  //pluginTimeout
}

const serv = Fastify(options)

serv.register(websocket);

// serv.register(fastifyStatic, {
//   root: path.join(__dirname, 'app'),
//   prefix: '/app/',
// });

/*creer les routes avec leur handlers, hooks, decorators, plugins*/
async function upgrade(req, rep) {
  const script = await fs.readFile('app/index.html');
  rep.header('Content-Type', 'text/html');
  rep.send(script);
}

serv.route({
  method: 'GET',
  url: '/pong',
  handler: upgrade,
  wsHandler: (socket, req) => {
    socket.on('message', (message) => {
      socket.send('hi from server')})
    },
  websocket: true
});

/*lancer le server*/
function catchError(err, address) {
  if (err) {
    serv.log.error(err);
    process.exit(1);
  }
  console.log(`Pong Microservice listening on ${port} at ${address}`);
}

serv.listen({ port: port }, catchError)

process.on('SIGINT', () => {
  console.log('Received SIGINT. Gracefully shutting down...');
  serv.close().then(() => {
    console.log('successfully closed!')
  }, (err) => {
    console.log('an error happened', err)
  });
});
