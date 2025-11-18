import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { bffFriendRoutes } from './routeFriends.js';
import { bffAccessibilityRoutes } from './routeAccessibility.js';
import { bffAccountRoutes } from './routeAccount.js';
import { bffUsersRoutes } from './routeUserProfile.js';
import { options } from './serv.conf.js';

const serv: FastifyInstance = Fastify(options);

serv.register(cors, {
	origin: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE']
});

serv.register(bffFriendRoutes);
serv.register(bffAccessibilityRoutes);
serv.register(bffAccountRoutes);
serv.register(bffUsersRoutes);

const start = async () => {
	try {
		console.log('listening on 1818');
		await serv.listen({ port: 1818, host: '0.0.0.0' });
	}
	catch (err) {
		console.error('server error:', err);
		process.exit(1);
	}
};

start();
