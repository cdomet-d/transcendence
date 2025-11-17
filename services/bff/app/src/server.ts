import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { bffFriendRoutes } from './routeFriends.js';
import { bffAccessibilityRoutes } from './routeAccessibility.js';
import { bffAccountRoutes } from './routeAccount.js';
import { options } from './serv.conf.js';

const serv: FastifyInstance = Fastify(options);

serv.register(cors, {
	origin: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE']
});

serv.register(bffFriendRoutes);
serv.register(bffAccessibilityRoutes);
serv.register(bffAccountRoutes);

const start = async () => {
	try {
		await serv.listen({ port: 1818, host: '0.0.0.0' });
	}
	catch (err) {
		serv.log.error(err);
		process.exit(1);
	}
};

start();
