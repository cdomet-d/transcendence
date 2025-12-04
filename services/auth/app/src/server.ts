'use strict';
// Third-party modules
import cookie from '@fastify/cookie';
import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

// Local modules
import { authenticationRoutes } from './authentication/authentication.js';
import { options } from './serv.conf.js';
import dbConnector from './db.js';

(async () => {
    try {
        const serv = await init();
        await runServ(serv);
    } catch (err) {
        console.error('server', err);
        process.exit(1);
    }
})();

const authPlugin = fp(async (serv: FastifyInstance) => {
    serv.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
        serv.log.info(`PREHANDLER RUNNING FOR ${request.url}`);
        if (request.url === '/status' || request.url === '/login' || request.url === '/register')
            return;
        try {
            await request.jwtVerify();
        } catch (error) {
            return reply.code(401).send({ message: 'Unauthorized' });
        }
    });
});

//init server
export async function init(): Promise<FastifyInstance> {
    const serv: FastifyInstance = Fastify(options);
    await addPlugins(serv);
    await serv.ready();

    return serv;
}

//add plugins
async function addPlugins(serv: FastifyInstance) {
    serv.register(dbConnector);
    await serv.register(cookie);
    await serv.register(fastifyJwt, { secret: process.env.JWT_SECRET!, cookie: { cookieName: 'token', signed: false } } );
    await serv.register(authPlugin);
    await serv.register(authenticationRoutes);
}

//run server
async function runServ(serv: FastifyInstance): Promise<void> {
    const port: number = getPort();
    const address: string = await serv.listen({ port: port, host: '0.0.0.0' });
    serv.log.info(`Auth Microservice listening on ${port} at ${address}`);
}

function getPort(): number {
    const port: number = Number(process.env.PORT);
    if (Number.isNaN(port)) {
        throw new Error('Invalid port');
    }
    return port;
}

// serv.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
//     serv.log.info(`PREHANDLER RUNNING FOR ${request.url}`);
//     if (request.url === '/status' || request.url === '/login' || request.url === '/register') return;
//         try {
//             await request.jwtVerify();
//             serv.log.info(request.user);
//         } catch (error) {
//             return reply.code(401).send({ message: 'Unauthorized' });
//         }
// });
