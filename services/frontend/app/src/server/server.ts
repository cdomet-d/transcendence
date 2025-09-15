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
					root: "/app/dist/client/scripts",
					prefix: "/scripts/",
				})
				.register(fastifyStatic, {
					root: "/app/dist/client/pages",
					prefix: "/pages/",
					decorateReply: false
				})
				.register(fastifyStatic, {
					root: "/app/src/assets/",
					prefix: "/assets/",
					decorateReply: false
				})
				.register(fastifyStatic, {
					root: [
						"/app/src/css",
						"/app/src/images",
					],
					prefix: "/",
					decorateReply: false
				})
				.register(cookie/*, {
					secret: "", //TODO: add secret ?
				}*/)
				// .register(fastifyVite, {
				// 	root: "/app",
				// 	dev: process.argv.includes('--dev'),
				// });
}
