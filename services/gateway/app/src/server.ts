import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { gatewayFriendRoutes } from './routeFriends.js';
import { options } from './serv.conf.js'; // 1. Import your options

const serv: FastifyInstance = Fastify(options); 

serv.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

serv.register(gatewayFriendRoutes);

const start = async () => {
    try {
        console.log('listening on 4040');
        await serv.listen({ port: 4040, host: '0.0.0.0' });
    }
    catch (err) {
        console.error('server error:', err);
        process.exit(1);
    }
};

start();