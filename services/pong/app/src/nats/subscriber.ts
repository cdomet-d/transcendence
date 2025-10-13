import { connect, StringCodec, type NatsConnection } from 'nats';
import { natsPublish } from './publisher.js'
import { Game, type gameInfo } from '../classes/game.class.js';
import type { FastifyInstance } from 'fastify';

export async function initNatsConnexion(): Promise<NatsConnection> {
	let token: string | undefined = process.env.NATS_SERVER_TOKEN;
	if (!token)
		throw new Error("NATS token undefined");
	const nc = await connect({ servers: "nats://nats-server:4222", token: token });
	return (nc);
}

export async function natsSubscription(serv: FastifyInstance) {
	let token = process.env.NATS_SERVER_TOKEN;
	const nc = await connect({ servers: "nats://nats-server:4222", token: token ?? "" });
	const sc = StringCodec();

	const sub = nc.subscribe('game.request');
	console.log(`Listening for messages on "game.request"...`);

	(async () => {
		for await (const msg of sub) {

			const _gameInfo: gameInfo = JSON.parse(sc.decode(msg.data));
			serv.gameRegistry.addGame(new Game(_gameInfo));
			// console.log(`Received message: ${JSON.stringify(_gameInfo)}`);

			// Approval given HERE from PONG if game is ok to start
			if (msg.reply) {
				const gameReply = {
					event: "approved",
					match: _gameInfo
				}
				natsPublish(msg.reply, JSON.stringify(gameReply));
			} else {
				// const gameReply = {
				// 	event: "declined",
				// 	match: _gameInfo
				// }
				// natsPublish("game.reply", JSON.stringify(gameReply));
				console.log(`Error: No reply subject provided in "game.request"`);
				return;
			}
		}
	})();

	// serv.gameRegistry.addGame(new Game(gameobj)); //TODO: for testing
};

import type { user } from '../classes/game.class.js';
const player1: user = {
	_username: "cha",
	_userID: 1
}

const player2: user = {
	_username: "sweet",
	_userID: 2
}

const gameobj: gameInfo = {
	_gameID: 1,
	_score: [],
	_local: true,
	_users: [player1, player2],
	_winner: "",
	_loser: ""
}
