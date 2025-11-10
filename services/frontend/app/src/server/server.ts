import { options } from './serv.conf.js';
// import { renderNotFound } from '../client/pages/html.pages.js';
// import { servRoutes } from './route.js';
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

const serv: FastifyInstance = Fastify(options);

try {
    console.log('JUST A TEST');
    serv.setNotFoundHandler(notFound);
    await addPlugins(serv);
    await serv.ready();
    await serv.listen({ port: 1212, host: '0.0.0.0' });
    console.log('EVERYTHING IS FINE');
} catch (err) {
    serv.log.error(err);
    process.exit(1);
}

async function addPlugins(serv: FastifyInstance) {
    console.log('ADDING PLUGINS');
    await serv
        .register(fastifyStatic, {
            root: '/app/dist/client/',
            prefix: '/public/',
            decorateReply: true,
            setHeaders: (res, pathName) => {
                if (pathName.endsWith('.woff')) {
                    res.setHeader('Content-Type', 'font/woff');
                } else if (pathName.endsWith('.png')) {
                    res.setHeader('Content-Type', 'image/png');
                } else if (pathName.endsWith('.js')) {
                    res.setHeader('Content-Type', 'application/javascript');
                }
            },
        })
        .get('/*', (req, res) => {
            console.log('SERVING HTML IN ADDPLUGIN');
            res.sendFile('index.html');
        })
        .register(
            cookie /*, {
					secret: "", //TODO: add secret ?
				}*/,
        );
}
