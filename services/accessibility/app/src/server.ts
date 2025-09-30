import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import { options } from './serv.conf.js';
import dbConnector from "./db.js"

const serv: FastifyInstance = Fastify(options);

serv.register(dbConnector);

serv.get('/ping', async (request, reply) => ({ pong: 'it works!' }));

serv.listen({ port: 1313, host: '0.0.0.0' }, err => {
  if (err) throw err;
  console.log('Server running');
});