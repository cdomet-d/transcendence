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
import type { NatsConnection } from 'nats';

(async () => {
    try {
        const serv: FastifyInstance = await init();
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
    });
    serv.register(wsRoute);
}

//run server
async function runServ(serv: FastifyInstance): Promise<void> {
    const port: number = getPort();
    await serv.listen({ port: port, host: '0.0.0.0' });
}

function getPort(): number {
    const port: number = Number(process.env.PORT);
    if (Number.isNaN(port)) {
        throw new Error('Invalid port');
    }
    return port;
}
