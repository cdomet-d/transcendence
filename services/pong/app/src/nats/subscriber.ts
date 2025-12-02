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

			const gameInfo: gameInfo = JSON.parse(sc.decode(msg.data));
			console.log("game id", gameInfo.gameID)
			console.log("remote", gameInfo.remote)

			// serv.log.info(`Received message: ${JSON.stringify(_gameInfo)}`);
			serv.gameRegistry.addGame(new Game(gameInfo, serv.nc, serv.log));

			if (msg.reply) {
				const game = {
					gameID: gameInfo.gameID,
					users: gameInfo.users,
					remote: gameInfo.remote
					// gameSettings
				}
				natsPublish(serv.nc, msg.reply, JSON.stringify(game));
			}
		}
	})();

	// serv.gameRegistry.addGame(new Game(gameobj, serv.nc, serv.log)); //TODO: for testing
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
	gameID: "1",
	tournamentID: "99",
	remote: false,
	users: [player1, player2],
	score: [0, 0],
	winnerID: 0,
	loserID: 0,
	duration: 0,
	longuestPass: 0,
	startTime: ""
}