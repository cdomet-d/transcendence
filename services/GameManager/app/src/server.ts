import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import { options } from './serv.conf.js';
import { natsSubscription } from './subscriber.js';

try {
	const serv: FastifyInstance = Fastify(options);
	serv.listen({ port: 1818, host: '0.0.0.0' }).then(() => {
		serv.log.info("serv run");
	});
	natsSubscription();
}
catch (err) {
	console.error('server error:', err);
	process.exit(1);
}
