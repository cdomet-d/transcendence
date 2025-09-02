import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static'
import { mainRoute } from './route.js';

try {
	const serv: FastifyInstance = Fastify({logger: {file: "/app/server.log"}});
	addPlugins(serv);
	await serv.ready();
	serv.listen({ port: 1212, host: '0.0.0.0' }).then(() => {
		serv.log.info("serv run");
	});
}
catch (err) {
	console.error('server error:', err);
	process.exit(1);
}

function addPlugins(serv: FastifyInstance) {
	serv.register(fastifyStatic, {
			root: [
				"/app/static/",
				"/app/images/",
				"/app/dist/",
				"/app/dist/backend/",
			],
		})
		.register(mainRoute);
}
