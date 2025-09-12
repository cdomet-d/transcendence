import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import { servRoutes } from './route.js';
import { options } from './serv.conf.js';
import fastifyStatic from '@fastify/static';
import cookie from '@fastify/cookie';
// import fastifyVite from '@fastify/vite'

try {
	const serv: FastifyInstance = Fastify(options);
	await addPlugins(serv);
	// await serv.vite.ready();
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
	await serv.register(servRoutes)
				.register(fastifyStatic, {
					root: [
						"/app/src",
						"/app/src/css",
						"/app/dist/client/spaRouter",
						"/app/dist/client/",
						"/app/dist/client/scripts/game",
						"/app/dist/",
						"/app/src/images"
					]
				})
				.register(cookie/*, {
					secret: "une-super-cle",
				}*/)
				// .register(fastifyVite, {
				// 	root: "/app",
				// 	dev: process.argv.includes('--dev'),
				// });
}
