import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { accountRoutes } from './routes.js';
import dbConnector from "./db.js"

const serv: FastifyInstance = Fastify({
	logger: true
});

serv.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

serv.register(dbConnector);
serv.register(accountRoutes);

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
