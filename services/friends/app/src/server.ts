import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { options } from './serv.conf.js';
import { friendRoutes } from './route.js';

interface Params {
  username: string;
}

  try {
	const serv: FastifyInstance = Fastify(options);

	serv.register(friendRoutes);
	console.log("in the fastify friends serv");
	serv.listen({ port: 1616, host: '0.0.0.0' }).then(() => {
		serv.log.info("serv run");
	});
}
catch (err) {
	console.error('server error:', err);
	process.exit(1);
}
