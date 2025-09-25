import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import { options } from './serv.conf.js';

try {
  const serv: FastifyInstance = Fastify(options);

  // Define routes before listen
  serv.get('/ping', async (request, reply) => {
    return { pong: 'it works!' };
  });

  serv.listen({ port: 1313, host: '0.0.0.0' }).then(() => {
    serv.log.info("serv run");
  });
}
catch (err) {
  console.error('server error:', err);
  process.exit(1);
}

