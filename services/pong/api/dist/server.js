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
import { wsRoute } from './routes/websocket.js';
import { options } from './serv.conf.js';
/***********************************************/
// const __filename = fileURLToPath(import.meta.url);
// export const __dirname = path.dirname(__filename);
//init server
try {
    const serv = Fastify(options);
    addPlugins(serv);
    await serv.ready();
    runServ(serv);
}
catch (err) {
    console.error('server error:', err);
    process.exit(1);
}
//add plugins
function addPlugins(serv) {
    serv.register(websocket);
    serv.register(fastifyStatic, {
        root: [
            '/usr/src/app/static/',
            '/usr/src/app/dist/frontend/'
        ],
        prefix: '/game/match/',
    });
    serv.register(wsRoute);
}
//run server
function runServ(serv) {
    const port = Number(process.env.PORT);
    if (Number.isNaN(port)) {
        throw new Error("Invalid port");
    }
    serv.listen({ port: port, host: '0.0.0.0' })
        .then((address) => {
        serv.log.info(`Pong Microservice listening on ${port} at ${address}`);
    })
        .catch((err) => { throw err; });
}
