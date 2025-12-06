import { initNatsConnection } from './utils/nats.js';
import { options } from './serv.conf.js';
import cookie from '@fastify/cookie';
import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import type { FastifyInstance } from 'fastify';
import type { NatsConnection } from 'nats';

import { bffFriendRoutes } from './friends/routeFriends.js';
import { bffAccessibilityRoutes } from './accessibility/routeAccessibility.js';
import { bffUsersRoutes } from './users/routeUserProfile.js';

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
}

function getPort(): number {
	const port: number = Number(process.env.PORT);
	if (Number.isNaN(port)) {
		throw new Error('Invalid port');
	}
	return port;
}
