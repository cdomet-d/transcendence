'use strict'

import Fastify from 'fastify'
import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url';
import websocket from '@fastify/websocket'
import fastifyStatic from '@fastify/static';
import wsRoute from './routes/websocket.js';

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

const chargePlugins = async () => {
  try {
    await serv
          .register(websocket)
          .register(fastifyStatic, {
              root: path.join(__dirname, 'frontend'),
              prefix: '/game/match/',
            });
  } catch (err) {
    serv.log.error(err);
    process.exit(1);
  }
}

await chargePlugins();

serv.register(wsRoute);

/*lancer le server*/
serv.listen({ port: port, host: '0.0.0.0' })
    .then((address) => serv.log.info(`Pong Microservice listening on ${port} at ${address}`))
    .catch((err) => {
        serv.log.error(err);
        process.exit(1);
      });
