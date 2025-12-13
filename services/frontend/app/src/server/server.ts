import { options } from './serv.conf.js';
import { servRoutes } from './route.js';
import cookie from '@fastify/cookie';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import websocket from '@fastify/websocket';
import type { WebSocket } from '@fastify/websocket';
import { initNatsConnection, natsSubscription } from './notifications/nats-subscriber.js';
import type { NatsConnection } from 'nats';
import { Users } from './notifications/users-class.js';
import fastifyJwt from '@fastify/jwt';

(async () => {
	try {
		const serv = await init();
		await serv.listen({ port: 1212, host: '0.0.0.0' });
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
})();

export async function init(): Promise<FastifyInstance> {
	const serv: FastifyInstance = Fastify(options);
	serv.setNotFoundHandler(notFound);

	//plugins
	await addPlugins(serv);

	// decorations
	serv.decorate('users', new Users());
	const nc: NatsConnection = await initNatsConnection();
	serv.decorate('nc', nc);
	await natsSubscription(serv);

	//hooks
	addHooks(serv);

	await serv.ready();
	return serv;
}

function notFound(request: FastifyRequest, reply: FastifyReply) {
	reply
		.code(404)
		.header('Content-Type', 'json')
		.send({ error: 'Not Found', message: 'The requested page does not exist' });
}

function addHooks(serv: FastifyInstance) {
	serv.addHook('onClose', (instance, done) => {
		instance.nc.close();
		done();
	});
}

async function addPlugins(serv: FastifyInstance) {
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
        .register(websocket, {
            errorHandler: function (
                error,
                socket: WebSocket,
                req: FastifyRequest,
                reply: FastifyReply
            ) {
                serv.log.error(error);
                socket.close(1011, error.message);
            },
            preClose: (done) => {
                const serverWS = serv.websocketServer;
                for (const socket of serverWS.clients)
                    socket.close(1001, 'WS server is going offline');
                serverWS.close(done);
            },
            options: {},
        })
        .register(servRoutes)
        .register(cookie)
        .register(fastifyJwt, { secret: process.env.JWT_SECRET! });
}
