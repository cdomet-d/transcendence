import type { FastifyInstance } from 'fastify';

import Fastify from 'fastify'
import { routeFriend } from './routeFriends.js';
import { routeAccount } from './routeAccount.js';
import cors from '@fastify/cors';
import dbConnector from "./db.js"

const serv: FastifyInstance = Fastify({
	logger: true
});

serv.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

serv.register(dbConnector);
serv.register(routeFriend);
serv.register(routeAccount);

const start = async () => {
	try {
		await serv.listen({ port: 1616, host: '0.0.0.0' });
	} catch (err) {
		serv.log.error(err);
		process.exit(1);
	}
};

start();
