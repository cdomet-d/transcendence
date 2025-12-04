'use strict';
import Fastify from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import websocket from '@fastify/websocket';
import type { FastifyInstance } from 'fastify';

import { wsRoute } from './routes/wsRoute.js';
import { options } from './serv.conf.js';
import { natsConnect } from './nats/publisher.gm.js';
import { natsSubscribe } from './nats/subscriber.gm.js';

try {
    const serv: FastifyInstance = Fastify(options);
    addPlugins(serv);
    await serv.ready();
    runServ(serv);
} catch (err) {
    console.error('server error:', err);
    process.exit(1);
}

//add hook
// function addHooks(serv: FastifyInstance) {
//     serv.addHook('onClose', (instance, done) => {
//       instance.nc.close();
//       done()
//     })
// } //TODO

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

    natsSubscribe();
    natsConnect();
}
