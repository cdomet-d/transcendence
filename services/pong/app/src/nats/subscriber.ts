import { connect, StringCodec, type NatsConnection } from 'nats';
import { natsPublish } from './publisher.js'
import { Game } from '../classes/game-class.js';
import type { FastifyInstance } from 'fastify';
import type { gameInfo } from '../classes/game-interfaces.js';

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
			console.log("game id", _gameInfo.gameID)
			console.log("remote", _gameInfo.remote)

			// serv.log.info(`Received message: ${JSON.stringify(_gameInfo)}`);
			serv.gameRegistry.addGame(new Game(_gameInfo, serv.nc, serv.log));

			if (msg.reply) {
				const game = {
					gameID: _gameInfo.gameID,
					users: _gameInfo.users,
					remote: _gameInfo.remote
					// gameSettings
				}
				natsPublish(serv.nc, msg.reply, JSON.stringify(game));
			}
		}
	})();
};

import type { user } from '../classes/game-interfaces.js';
const player1: user = {
	userID: 1,
	username: "cha",
}

const player2: user = {
	userID: 2,
	username: "sweet",
}

const gameobj: gameInfo = {
	lobbyID: 1,
	gameID: "",
	tournamentID: 99,
	remote: false,
	users: [player1, player2],
	score: [0, 0],
	winnerID: 0,
	loserID: 0,
	duration: 0,
	longuestPass: 0
}