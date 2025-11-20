import fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { userRoutes } from './routes.js';
import dbConnector from "./db.js";
import { options } from './serv.conf.js';

export async function buildServer(): Promise<FastifyInstance> {
	const serv: FastifyInstance = fastify(options);

	serv.register(cors, {
		origin: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE']
	});

	serv.register(dbConnector);
	serv.register(userRoutes);

	await (serv.ready());
	return (serv);
}

