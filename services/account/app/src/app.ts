import fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { accountRoutes } from './routes.js';
import dbConnector from "./db.js";

export async function buildServer(): Promise<FastifyInstance> {
	const serv: FastifyInstance = fastify({
		logger: true
	});

	serv.register(cors, {
		origin: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE']
	});

	serv.register(dbConnector);
	serv.register(accountRoutes);

	await (serv.ready());

	return (serv);
}

