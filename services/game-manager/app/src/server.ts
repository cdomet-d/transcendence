'use strict';
import Fastify from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import websocket from '@fastify/websocket';
import type { FastifyInstance } from 'fastify';

import { wsRoute } from './routes/wsRoute.js';
import { options } from './serv.conf.js';
import { natsConnect } from './nats/publisher.gm.js';
import { natsSubscribe } from './nats/subscriber.gm.js';
import type { NatsConnection } from 'nats';

(async () => {
    try {
        const serv: FastifyInstance = await init();
        await serv.ready();
        runServ(serv);
    } catch (err) {
        console.error('server error:', err);
        process.exit(1);
    }
})();

export async function init(): Promise<FastifyInstance> {
	const serv: FastifyInstance = Fastify(options);
	
	//plugins
	addPlugins(serv);

    // decorations
	const nc: NatsConnection = await natsConnect();
	serv.decorate('nc', nc);
	await natsSubscribe(serv);

	//hooks
	addHooks(serv);

	await serv.ready();
    return serv;
}

function addHooks(serv: FastifyInstance) {
	serv.addHook('onClose', (instance, done) => {
        instance.nc.close();
        done()
	})
}

function addPlugins(serv: FastifyInstance) {
    serv.register(websocket, {
        errorHandler: function (
            error,
            socket: WebSocket,
            req: FastifyRequest,
            reply: FastifyReply
        ) {
            //TODO: send html error page ?
            serv.log.error(error);
            socket.close();
        },
        options: {},
    });
    serv.register(wsRoute);
}

function runServ(serv: FastifyInstance): void {
    const port: number = Number(process.env.PORT);
    if (Number.isNaN(port)) {
        throw new Error('Invalid port');
    }

    serv.listen({ port: port, host: '0.0.0.0' })
        .then(() => {})
        .catch((err) => {
            throw err;
        });
}