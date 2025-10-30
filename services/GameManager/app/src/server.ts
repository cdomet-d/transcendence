'use strict'
// Third-party modules
import Fastify from 'fastify'
import websocket from '@fastify/websocket'
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// Local modules
import { wsRoute } from './routes/wsRoute.js';
import { options } from './serv.conf.js'
import { natsConnect } from './nats/publisher.js';
import { natsSubscribe } from './nats/subscriber.js';

try {
	const serv: FastifyInstance = Fastify(options);
	addPlugins(serv);
	await serv.ready();
	runServ(serv);
} catch (err) {
	console.error('server error:', err);
	process.exit(1);
}

function addPlugins(serv: FastifyInstance) {
	serv.register(websocket, {
		errorHandler: function (error, socket: WebSocket, req: FastifyRequest, reply: FastifyReply) {
			//TODO: send html error page ?
			serv.log.error(error);
			socket.close()
		},
		options: {},
	});
	serv.register(wsRoute);
}

function runServ(serv: FastifyInstance): void {
	const port: number = Number(process.env.PORT);
	if (Number.isNaN(port)) {
		throw new Error("Invalid port");
	}

	serv.listen({ port: port, host: '0.0.0.0' })
		.then((address) => {
			serv.log.info(`GameManager Microservice listening on ${port} at ${address}`);
		})
		.catch((err) => { throw err; });

	natsSubscribe();
	natsConnect();
}
