'use strict'
/***************** MODULES *********************/
// Core node modules
import path from 'path'
import { fileURLToPath } from 'url';

// Third-party modules
import Fastify from 'fastify'
import websocket from '@fastify/websocket'
import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';
// Local modules
import { wsRoute } from './routes/websocket.js';
import { options } from './serv.conf.js'
/***********************************************/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//init server
try {
  const serv: FastifyInstance = Fastify(options);
  addPlugins(serv);
  runServ(serv);
} catch (err) {
  console.error('init server failed:', err);
  process.exit(1);
}

//add plugins
async function addPlugins(serv: FastifyInstance) {
  await serv.register(websocket)
          .register(fastifyStatic, {
              root: path.join(__dirname, 'frontend'),
              prefix: '/game/match/',
            })
          .register(wsRoute);

  try {
    await serv.ready();
  } catch (err) {
    serv.log.error(err);
    process.exit(1);
  }
}

//run server
function runServ(serv: FastifyInstance) {
  const port: number = Number(process.env.PORT);

  if (Number.isNaN(port)) {
    serv.log.error("Invalid port");
    process.exit(1);
  }

  serv.listen({ port: port, host: '0.0.0.0' })
      .then((address) => {
        serv.log.info(`Pong Microservice listening on ${port} at ${address}`);
      })
      .catch((err) => {
          serv.log.error(err);
          process.exit(1);
        });
}

