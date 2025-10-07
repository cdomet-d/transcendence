import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import dbConnector from "./db.js"
//import { accountRoutes } from './routes.js';
import { minimalRoutes } from './routes.js';
import cors from '@fastify/cors';

const serv: FastifyInstance = Fastify({
	logger: true
});

serv.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

serv.register(dbConnector);
//serv.register(accountRoutes);
serv.register(minimalRoutes);

const start = async () => {
	try {
		console.log('listening on 1414');
		await serv.listen({ port: 1414, host: '0.0.0.0' });
	}
	catch (err) {
		console.error('server error:', err);
		process.exit(1);
	}
};

start();
