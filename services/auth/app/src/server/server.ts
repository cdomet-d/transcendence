'use strict'
// Third-party modules 
import jwt from 'jsonwebtoken';
import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
// Local modules
import { options } from './serv.conf.js'
import { initNatsConnection, natsSubscription } from '../nats/subscriber.js';
import { healthcheck, userRoutes } from '../authentication.js';

export var _serv: FastifyInstance;

(async () => {
	try {
		const serv = await init();
		await runServ(serv);
		_serv = serv; // is this bad or?
		healthcheck(serv);
	} catch (err) {
		console.error('server', err);
		process.exit(1);
	}
})();

//init server
export async function init(): Promise<FastifyInstance> {
	const serv: FastifyInstance = Fastify(options);

	//nats
	const nc = await initNatsConnection();
	serv.decorate("nc", nc);
	await natsSubscription(serv);

	//plugins
	addPlugins(serv);
	await serv.ready();

	return (serv);
}

//add plugins
function addPlugins(serv: FastifyInstance) {
	serv.register(cookie);
	serv.register(userRoutes, { prefix: '/api/users' });
}

//run server
async function runServ(serv: FastifyInstance): Promise<void> {
	const port: number = getPort();
	const address: string = await serv.listen({ port: port, host: '0.0.0.0' });
	serv.log.info(`Auth Microservice listening on ${port} at ${address}`);
}

function getPort(): number {
	const port: number = Number(process.env.PORT);
	if (Number.isNaN(port)) {
		throw new Error("Invalid port");
	}
	return port;
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // //
(() => {
	const payload: object = { userID: "123", role: "Player", exp: 60 * 60 };
	const secretKey = process.env.SECRET;
	if (!secretKey) {
		console.log("Error: could not retrieve secret from .env");
		return;
	}
	const token = jwt.sign(payload, secretKey);

	console.log("REAL:", token);
})();

// // // // // // // // // // // // // // // // // // // // // // // // // // // //
const listeners = ['SIGINT', 'SIGTERM']
listeners.forEach((signal) => {
	process.on(signal, async () => {
		await _serv.close()
		process.exit(0)
	})
})
