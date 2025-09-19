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
import { GameRegistry } from './classes/gameRegistry.class.js';
/***********************************************/

// const __filename = fileURLToPath(import.meta.url);
// export const __dirname = path.dirname(__filename);

try {
	const serv = init();
	await serv.ready();
	await runServ(serv);
	// natsSubscribtion(serv.gameRegistry);
} catch (err) {
	console.error('server', err);
	process.exit(1);
}

//init server
function init(): FastifyInstance {
	const serv: FastifyInstance = Fastify(options);
	serv.decorate("gameRegistry", new GameRegistry());
	addPlugins(serv);
	return (serv);
}

//add plugins
function addPlugins(serv: FastifyInstance) {
	serv.register(websocket);
	serv.register(wsRoute);
}

//run server
async function runServ(serv: FastifyInstance): Promise<void> {
	const port: number = getPort();
	const address: string = await serv.listen({ port: port, host: '0.0.0.0' });
	serv.log.info(`Pong Microservice listening on ${port} at ${address}`);
}

function getPort(): number {
	const port: number = Number(process.env.PORT);
	if (Number.isNaN(port)) {
		throw new Error("Invalid port");
	}
	return port;
}
