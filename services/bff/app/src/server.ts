import { options } from './serv.conf.js';
import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import { initNatsConnection } from './utils/nats.js';
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

//init server
export async function init(): Promise<FastifyInstance> {
	const serv: FastifyInstance = Fastify(options);

	//plugins
	addPlugins(serv);

	// decorations
	const nc: NatsConnection = await initNatsConnection();
	serv.decorate("nats", nc);

	//hooks
	addHook(serv);

	await serv.ready();
	return (serv);
}

function addHook(serv: FastifyInstance) {
	serv.addHook('onClose', (instance, done) => {
		instance.nats.close();
		done()
	})
}

//add plugins
function addPlugins(serv: FastifyInstance) {
	serv.register(fastifyJwt, { secret: process.env.JWT_SECRET! });
	serv.register(cookie);
	serv.register(bffAccessibilityRoutes);
	serv.register(bffUsersRoutes);
	serv.register(bffFriendRoutes);
}

//run server
async function runServ(serv: FastifyInstance): Promise<void> {
	const port: number = getPort();
	const address: string = await serv.listen({ port: port, host: '0.0.0.0' });
	serv.log.info(`BFF Microservice listening on ${port} at ${address}`);
}

function getPort(): number {
	const port: number = Number(process.env.PORT);
	if (Number.isNaN(port)) {
		throw new Error("Invalid port");
	}
	return port;
}
