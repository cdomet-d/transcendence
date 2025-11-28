import { connect, StringCodec, JSONCodec, type NatsConnection } from "nats";
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

let nc: NatsConnection;

export const jsonCodec = JSONCodec();
export const stringCodec = StringCodec();

export default fp(async (serv: FastifyInstance) => {
	try {
		nc = await connect({ servers: "nats://nats:4222" });

		serv.log.info("Connected to NATS server");

		serv.decorate('nats', nc);

		serv.addHook('onClose', async (instance) => {
			await nc.close();
			serv.log.info("NATS connection closed");
		});

	} catch (err) {
		serv.log.error(`NATS Connection Failed: ${err}`);
	}
});