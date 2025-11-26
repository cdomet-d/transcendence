'use strict';
// Third-party modules
import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import type { WebSocket } from '@fastify/websocket';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
// Local modules
import { wsRoute } from './route.js';
import { options } from './serv-conf.js';
import { initNatsConnection, natsSubscription } from './nats/subscriber.js';
import { GameRegistry } from './classes/gameRegistry-class.js';
import { NatsConnection } from 'nats';

(async () => {
    try {
        const serv = await init();
        await runServ(serv);
    } catch (err) {
        console.error('server', err);
        process.exit(1);
    }
})();

//init server
export async function init(): Promise<FastifyInstance> {
	const serv: FastifyInstance = Fastify(options);
	
	//plugins
	addPlugins(serv);

	// decorations
	serv.decorate("gameRegistry", new GameRegistry());
	const nc: NatsConnection = await initNatsConnection();
	serv.decorate("nc", nc);
	await natsSubscription(serv);

	//hooks
	addHooks(serv);

	await serv.ready();
	return (serv);
}

//add hook
function addHooks(serv: FastifyInstance) {
	serv.addHook('onClose', (instance, done) => {
	  instance.nc.close();
	  done()
	})
}

//add plugins
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

//run server
async function runServ(serv: FastifyInstance): Promise<void> {
    const port: number = getPort();
    const address: string = await serv.listen({ port: port, host: '0.0.0.0' });
}

function getPort(): number {
    const port: number = Number(process.env.PORT);
    if (Number.isNaN(port)) {
        throw new Error('Invalid port');
    }
    return port;
}
