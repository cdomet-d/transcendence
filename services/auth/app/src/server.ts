'use strict'
// Third-party modules 
import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
// Local modules
import { options } from './serv.conf.js'
import { bffAccountRoutes } from './authentication/authentication.js';

(async () => {
	try {
		const serv = await init();
		await runServ(serv);
	} catch (err) {
		console.error('server', err);
		process.exit(1);
	}
})();

//init server
export async function init(): Promise<FastifyInstance> {
	const serv: FastifyInstance = Fastify(options);

	//nats
	// const nc = await initNatsConnection();
	// serv.decorate("nc", nc);
	// await natsSubscription(serv);

	//plugins
	addPlugins(serv);
	await serv.ready();

	return (serv);
}

//add plugins
function addPlugins(serv: FastifyInstance) {
	serv.register(cookie);
	serv.register(bffAccountRoutes);
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

