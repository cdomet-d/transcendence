import Fastify from 'fastify'
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { servRoutes } from './route.js';
import { options } from './serv.conf.js';
import fastifyStatic from '@fastify/static';
import cookie from '@fastify/cookie';
import { renderNotFound } from '../client/pages/html.pages.js';
// import fastifyVite from '@fastify/vite'

try {
	const serv: FastifyInstance = Fastify(options);
	serv.setNotFoundHandler(error404Handler);
	await addPlugins(serv);
	// await serv.vite.ready();
	await serv.ready();
	await serv.listen({ port: 1212, host: '0.0.0.0' })
}
catch (err) {
	console.error('server error:', err);
	process.exit(1);
}

function error404Handler(request: FastifyRequest, reply: FastifyReply) {
	reply.code(404)
		 .header('Content-Type', 'text/html')
		 .send(renderNotFound());
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
					root: "/app/dist/client/assets/",
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
