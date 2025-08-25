'use strict';
/***************** MODULES *********************/
// Core node modules
import path from 'path';
import { fileURLToPath } from 'url';
// Third-party modules
import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import fastifyStatic from '@fastify/static';
// Local modules
import { wsRoute } from './routes/websocket.ts';
import { options } from './serv.conf.ts';
/***********************************************/
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//init server
const serv = Fastify(options);
//add plugins
await serv.register(websocket)
    .register(fastifyStatic, {
    root: path.join(__dirname, 'frontend'),
    prefix: '/game/match/',
})
    .register(wsRoute);
try {
    await serv.ready();
}
catch (err) {
    serv.log.error(err);
    process.exit(1);
}
//run server
serv.listen({ port: port, host: '0.0.0.0' })
    .then((address) => {
    serv.log.info(`Pong Microservice listening on ${port} at ${address}`);
})
    .catch((err) => {
    serv.log.error(err);
    process.exit(1);
});
