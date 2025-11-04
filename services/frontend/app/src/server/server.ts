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
	// console.log(__dirname)
    await serv
        .register(fastifyStatic, {
            root: '/dist/client',
            prefix: '/public/',
            decorateReply: true,
        })

        .register(servRoutes)
		// .register(fastifyStatic, {
        //     root: '/app/dist/client/scripts',
        //     prefix: '/public/scripts/',
        //     decorateReply: false,
        // })

		// .register(fastifyStatic, {
        //     root: '/app/dist/client/web-elements',
        //     prefix: '/public/web-elements/',
        //     decorateReply: false,
        // })
		
        // .register(fastifyStatic, {
        //     root: '/app/dist/client/css/',
        //     prefix: '/public/css/',
        //     decorateReply: false,
        // })
        // .register(fastifyStatic, {
        //     root: '/app/dist/client/assets/fonts/',
        //     prefix: '/public/fonts/',
        //     setHeaders(res, path, stat) {
        //         res.setHeader('Content-Type', 'font/woff');
        //     },
        //     decorateReply: false,
        // })


        // .register(fastifyStatic, {
        //     root: '/app/dist/client/assets/images/',
        //     prefix: '/public/images/',
        //     decorateReply: false,
        // })
        // .register(fastifyStatic, {
        //     root: '/app/dist/client/assets/locales/',
        //     prefix: '/public/locales/',
        //     decorateReply: false,
        // })
        .register(
            cookie /*, {
					secret: "", //TODO: add secret ?
				}*/
        );
}
