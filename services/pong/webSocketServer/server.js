'use strict'

import Fastify from 'fastify'
import fsp from 'fs/promises';
import fs from 'fs';
import websocket from '@fastify/websocket'
import path from 'path'
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';

const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* creer le server */
function checkProxy(address, hop) {
  if (address === '127.0.0.1'/*adresse nginx*/ || hop === 1)
    return true;
  return false;
}

const options = {
  logger: {
     file: '/usr/src/app/server.log' 
  },
  trustProxy: 1,  //checkProxy
  https: {
    key: fs.readFileSync('/run/secrets/ssl-key.pem'),
    cert: fs.readFileSync('/run/secrets/ssl-cert.pem'),
  }
  //connectionTimeout
  //forceCloseConnections
  //pluginTimeout
}

const serv = Fastify(options)

serv
  .register(websocket)
  .register(fastifyStatic, {
      root: path.join(__dirname, 'frontend'),
      prefix: '/game/match/',
    });

/*creer les routes avec leur handlers, hooks, decorators, plugins*/
async function upgrade(req, rep) {
  const script = await fsp.readFile('frontend/index.html');
  rep.header('Content-Type', 'text/html');
  rep.send(script);
}

serv.route({
  method: 'GET',
  url: '/game/match',
  handler: upgrade,
  wsHandler: (socket, req) => {
      socket.on('message', (message) => {
          socket.send('hi from server')
          serv.log.info("websocket connection worked")
        })
    },
  websocket: true
});

serv.addHook('onRequest', async (request, reply) => {
  serv.log.info(`new request from ${request.url}`);
});


/*lancer le server*/
function catchError(err, address) {
  if (err) {
    serv.log.error(err);
    process.exit(1);
  }
  serv.log.info(`Pong Microservice listening on ${port} at ${address}`);
  // serv.log.info(`dirname: ${__dirname}`);
  // serv.log.info(`filename: ${__filename}`);
  // serv.log.info(`url: ${import.meta.url}`);
}

serv.listen({ port: port, host: '0.0.0.0' }, catchError)

process.on('SIGINT', () => {
  serv.log.info('Received SIGINT. Gracefully shutting down...');
  serv.close().then(() => {
    serv.log.info('successfully closed!')
  }, (err) => {
    serv.log.error('an error happened', err)
  });
});

