import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify';
import { options } from './serv.conf.js';
import { natsPublish } from './nats/publisher.js';
import { natsSubscribe } from './nats/subscriber.js';

try {
	const serv: FastifyInstance = Fastify(options);
		const port: number = Number(process.env.PORT);
	if (Number.isNaN(port)) {
		throw new Error("Invalid port");
	}

	serv.listen({ port: port, host: '0.0.0.0' }).then(() => {
		serv.log.info("serv run");
	});
	natsSubscribe();
	natsPublish();
}
catch (err) {
	console.error('server error:', err);
	process.exit(1);
}
