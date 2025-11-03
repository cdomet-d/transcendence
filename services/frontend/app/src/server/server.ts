import { options } from './serv.conf.js';
// import { renderNotFound } from '../client/pages/html.pages.js';
import { servRoutes } from './route.js';
import cookie from '@fastify/cookie';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

function notFound(request: FastifyRequest, reply: FastifyReply) {
    reply
        .code(404)
        .header('Content-Type', 'json')
        .send({ error: 'Not Found', message: 'The requested page does not exist' });
}
try {
    const serv: FastifyInstance = Fastify(options);
    serv.setNotFoundHandler(notFound);
    await addPlugins(serv);
    await serv.ready();
    await serv.listen({ port: 1212, host: '0.0.0.0' });
    serv.log.info('Server running on 1212');
} catch (err) {
    console.error('server error:', err);
    process.exit(1);
}

async function addPlugins(serv: FastifyInstance) {
    await serv
        .register(servRoutes)
        .register(fastifyStatic, {
            root: '/app/dist/client/',
            prefix: '/',
            decorateReply: true,
        })
        .register(
            cookie /*, {
					secret: "", //TODO: add secret ?
				}*/
        );
}
