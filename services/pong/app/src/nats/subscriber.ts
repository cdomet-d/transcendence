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
			serv.log.info(`Received message: ${JSON.stringify(_gameInfo)}`);
			serv.gameRegistry.addGame(new Game(_gameInfo, serv.nc));

			// Approval given HERE from PONG if game is ok to start
			if (msg.reply) {
				const gameReply = {
					event: "approved",
					game: _gameInfo
				}
				natsPublish(msg.reply, JSON.stringify(gameReply));
			} else { // Real question is: What could go wrong? Honestly? I'd like to know, I'm being serious
				// const gameReply = {
				// 	event: "declined",
				// 	game: _gameInfo
				// }
				// natsPublish("game.reply", JSON.stringify(gameReply));
				console.log(`Error: No reply subject provided in "game.request"`);
				return;
			}
		}
	})();

	// serv.gameRegistry.addGame(new Game(gameobj, serv.nc)); //TODO: for testing
};

// import type { user } from '../classes/game.class.js';
// const player1: user = {
// 	username: "cha",
// 	userID: 1
// }

// const player2: user = {
// 	username: "sweet",
// 	userID: 2
// }

// const gameobj: gameInfo = {
// 	gameID: 1,
// 	score: [0, 0],
// 	local: true,
// 	users: [player1, player2],
// 	winnerID: 0,
// 	loserID: 0,
// }
