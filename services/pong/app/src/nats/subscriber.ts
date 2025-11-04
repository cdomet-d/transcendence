import { connect, StringCodec, type NatsConnection } from 'nats';
import { natsPublish } from './publisher.js'
import { Game, type gameInfo } from '../classes/game.class.js';
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

	const sub = serv.nc.subscribe('game.request');
	// console.log(`Listening for messages on "game.request"...`);

	(async () => {
		for await (const msg of sub) {

			const _gameInfo: gameInfo = JSON.parse(sc.decode(msg.data));
			// serv.log.info(`Received message: ${JSON.stringify(_gameInfo)}`);
			serv.gameRegistry.addGame(new Game(_gameInfo, serv.nc));

			// Approval given HERE from PONG if game is ok to start
			if (msg.reply)
				natsPublish(msg.reply, JSON.stringify({ gameID: _gameInfo.gameID, users: _gameInfo.users}));
		}
	})();

	// serv.gameRegistry.addGame(new Game(gameobj, serv.nc)); //TODO: for testing
};

