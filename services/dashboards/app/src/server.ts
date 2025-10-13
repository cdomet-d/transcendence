import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import { options } from './serv.conf.js';
import dbConnector from "./db.js"
import { dashboardRoutes } from './routes.js';

const serv: FastifyInstance = Fastify(options);

serv.register(dbConnector);
serv.register(dashboardRoutes);

const start = async () => {
	try {
		serv.listen({ port: 1515, host: '0.0.0.0' });
	}
	catch (err) {
		console.error('server error:', err);
		process.exit(1);
	}
};

start();
