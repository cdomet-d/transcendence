import { bffAccessibilityRoutes } from './routeAccessibility.js';
import { bffUsersRoutes } from './routeUserProfile.js';
import { options } from './serv.conf.js';
import cors from '@fastify/cors';
import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';

const serv: FastifyInstance = Fastify(options);

serv.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

serv.register(bffFriendRoutes);
serv.register(bffAccessibilityRoutes);
serv.register(bffUsersRoutes);

const start = async () => {
    try {
        await serv.listen({ port: 1818, host: '0.0.0.0' });
        serv.log.info(serv.printRoutes());
    } catch (err) {
        serv.log.error(err);
        process.exit(1);
    }
};

start();
