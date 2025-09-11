'use strict'
import Fastify from 'fastify'
import websocket from '@fastify/websocket'
import type { FastifyInstance } from 'fastify';
import { options } from './serv.conf.js';
import { initNATS } from './publisher.js';
import { wsRoute } from './routes/websocket.js';

try {
	const serv: FastifyInstance = Fastify(options);
	addPlugins(serv);
	await serv.ready();
	runServ(serv);
	initNATS();
} catch (err) {
	console.error('server error:', err);
	process.exit(1);
}

function addPlugins(serv: FastifyInstance) {
	serv.register(websocket);
	serv.register(wsRoute);
}

function runServ(serv: FastifyInstance): void {
	const port: number = Number(process.env.PORT);
	if (Number.isNaN(port)) {
		throw new Error("Invalid port");
	}

	serv.listen({ port: port, host: '0.0.0.0' })
			.then((address) => {
				serv.log.info(`Matchmaking Microservice listening on ${port} at ${address}`);
			})
			.catch((err) => { throw err; });
}
