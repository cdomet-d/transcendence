import { connect, StringCodec, type NatsConnection } from 'nats';
import { natsPublish } from './publisher.js'
import type { FastifyInstance } from 'fastify';

export async function initNatsConnection(): Promise<NatsConnection> {
	let token: string | undefined = process.env.NATS_SERVER_TOKEN;
	if (!token)
		throw new Error("NATS token undefined");
	const nc = await connect({ servers: "nats://nats-server:4222", token: token });
	return (nc);
}

export async function natsSubscription(serv: FastifyInstance) {
	const sc = StringCodec();

	const nc = serv.nc;
	const sub = nc.subscribe('auth.login');
	// console.log(`Listening for messages on "auth.login"...`);

	(async () => {
		for await (const msg of sub) {

			const _gameInfo = JSON.parse(sc.decode(msg.data));
			// console.log(`Received message: ${JSON.stringify(_gameInfo)}`);

			// Approval given HERE from PONG if game is ok to start
			if (msg.reply) {
				const gameReply = {
					event: "approved",
					game: _gameInfo
				}
				natsPublish(msg.reply, JSON.stringify(gameReply));
			}
		}
	})();
};