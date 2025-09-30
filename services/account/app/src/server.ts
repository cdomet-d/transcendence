import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import { options } from './serv.conf.js';
import dbConnector from "./db.js"
import { request } from 'http';
//import { accountRoutes } from './routes.js';


const serv: FastifyInstance = Fastify(options);

serv.register(dbConnector);
//serv.register(accountRoutes);

const start = async () => {
	try {
		serv.listen({ port: 1414, host: '0.0.0.0' });
	}
	catch (err) {
		console.error('server error:', err);
		process.exit(1);
	}
};

start();