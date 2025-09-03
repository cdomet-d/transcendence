import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static'
import { servRoutes } from './route.js';
import { options } from './serv.conf.js';
import fastifyVite from '@fastify/vite'

try {
	const serv: FastifyInstance = Fastify(options);
	await addPlugins(serv);
	await serv.vite.ready();
	await serv.ready();
	serv.listen({ port: 1212, host: '0.0.0.0' }).then(() => {
		serv.log.info("serv run");
	});
}
catch (err) {
	console.error('server error:', err);
	process.exit(1);
}

async function addPlugins(serv: FastifyInstance) {
	await serv.register(fastifyStatic, {
			root: [
				"/app/static/",
				"/app/images/",
				"/app/dist/client/",
				"/app/dist/client/pong/",
			],
		})
		.register(servRoutes)
		.register(fastifyVite, {
			root: "/app",
			clientModule: "/app/src/client/main.ts",
			dev: process.argv.includes('--dev'),
			spa: true,
		});
}
