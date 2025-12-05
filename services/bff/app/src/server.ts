import { initNatsConnection } from './nats.js';
import { options } from './serv.conf.js';
import cookie from '@fastify/cookie';
import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { NatsConnection } from 'nats';

import { bffFriendRoutes } from './routeFriends.js';
import { bffAccessibilityRoutes } from './routeAccessibility.js';
import { bffUsersRoutes } from './routeUserProfile.js';

(async () => {
	try {
		const serv = await init();
		await runServ(serv);
	} catch (err) {
		console.error('server', err);
		process.exit(1);
	}
})();

const authPlugin = fp(async (serv: FastifyInstance) => {
	serv.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
		serv.log.info(`PREHANDLER RUNNING FOR ${request.url}`);
		try {
			await request.jwtVerify();
		} catch (error) {
			if (error instanceof Error) serv.log.error(`${error.message}`);
			return reply.code(401).send({ message: `Unauthorized` });
		}
	});
});

//init server
export async function init(): Promise<FastifyInstance> {
	const serv: FastifyInstance = Fastify(options);

	//plugins
	await addPlugins(serv);

	// decorations
	const nc: NatsConnection = await initNatsConnection();
	serv.decorate('nats', nc);

	//hooks
	addHook(serv);

	await serv.ready();
	return serv;
}

function addHook(serv: FastifyInstance) {
	serv.addHook('onClose', (instance, done) => {
		instance.nats.close();
		done();
	});
}

//add plugins
async function addPlugins(serv: FastifyInstance) {
	await serv.register(fastifyJwt, { secret: process.env.JWT_SECRET! });
	await serv.register(cookie);
	serv.register(authPlugin);
	serv.register(bffAccessibilityRoutes);
	serv.register(bffUsersRoutes);
	serv.register(bffFriendRoutes);
}

//run server
async function runServ(serv: FastifyInstance): Promise<void> {
	const port: number = getPort();
	const address: string = await serv.listen({ port: port, host: '0.0.0.0' });
}

function getPort(): number {
	const port: number = Number(process.env.PORT);
	if (Number.isNaN(port)) {
		throw new Error('Invalid port');
	}
	return port;
}
