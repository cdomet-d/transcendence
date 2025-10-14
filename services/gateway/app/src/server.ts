import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

const serv: FastifyInstance = Fastify({
	logger: true
});

serv.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

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
