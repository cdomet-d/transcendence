'use strict'
import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';

import { options } from './serv.conf.js'
import { natsConnect } from './nats/publisher.js';
import { natsSubscribe } from './nats/subscriber.js';

try {
	const serv: FastifyInstance = Fastify(options);
	await serv.ready();
	runServ(serv);
} catch (err) {
	console.error('server error:', err);
	process.exit(1);
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
