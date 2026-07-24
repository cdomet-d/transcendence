import { options } from './serv.conf.js';
import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';

import { userRoutes } from './routes.js';
import dbConnector from "./db.js";

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

	//plugins
	addPlugins(serv);
	await serv.ready();

	return (serv);
}

//add plugins
function addPlugins(serv: FastifyInstance) {
	serv.register(fastifyJwt, { secret: process.env.JWT_SECRET! });
	serv.register(cookie);
	serv.register(dbConnector);
	serv.register(userRoutes);
}

//run server
async function runServ(serv: FastifyInstance): Promise<void> {
	const address: string = await serv.listen({ port: 2626, host: '0.0.0.0' });
	serv.log.info(`User Microservice listening on 2626 at ${address}`);
}
