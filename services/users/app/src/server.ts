import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import { options } from './serv.conf.js';
import cors from '@fastify/cors';
import { userRoutes } from './route.js';

const serv: FastifyInstance = Fastify({
	logger: true
});

serv.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

serv.register(userRoutes);

const start = async () => {
	try {
		await serv.listen({ port: 2626, host: '0.0.0.0' });
	} catch (err) {
		serv.log.error(err);
		process.exit(1);
	}
};

start();