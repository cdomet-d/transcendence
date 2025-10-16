import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { gatewayFriendRoutes } from './routeFriends.js';
import { gatewayStatsRoutes } from './routeStats.js';
import { gatewayAccessibilityRoutes } from './routeAccessibility.js';
import { gatewayAccountRoutes } from './routeAccount.js';
import { options } from './serv.conf.js'; 

const serv: FastifyInstance = Fastify(options);

serv.register(cors, {
	origin: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE']
});

serv.register(gatewayFriendRoutes);
serv.register(gatewayAccessibilityRoutes);
serv.register(gatewayStatsRoutes);
serv.register(gatewayAccountRoutes);

const start = async () => {
	try {
		console.log('listening on 4040');
		await serv.listen({ port: 4040, host: '0.0.0.0' });
	}
	catch (err) {
		console.error('server error:', err);
		process.exit(1);
	}
};

start();