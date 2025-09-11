'use strict'
/***************** MODULES *********************/
// Core node modules
import path from 'path'
import { fileURLToPath } from 'url';
// Third-party modules
import Fastify from 'fastify'
import websocket from '@fastify/websocket'
import type { FastifyInstance } from 'fastify';
// Local modules
import { wsRoute } from './routes/websocket.js';
import { options } from './serv.conf.js'
import { natsSubscribtion } from './subscriber.js';
/***********************************************/

// const __filename = fileURLToPath(import.meta.url);
// export const __dirname = path.dirname(__filename);

//init server
try {
	const serv: FastifyInstance = Fastify(options);
	addPlugins(serv);
	await serv.ready();
	runServ(serv);
	natsSubscribtion();
} catch (err) {
	console.error('server error:', err);
	process.exit(1);
}

//add plugins
function addPlugins(serv: FastifyInstance) {
	serv.register(websocket);
	serv.register(wsRoute);
}

//run server
function runServ(serv: FastifyInstance): void {
	const port: number = Number(process.env.PORT);
	if (Number.isNaN(port)) {
		throw new Error("Invalid port");
	}

	serv.listen({ port: port, host: '0.0.0.0' })
			.then((address) => {
				serv.log.info(`Pong Microservice listening on ${port} at ${address}`);
			})
			.catch((err) => { throw err; });
}
