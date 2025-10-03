import { connect, StringCodec, type NatsConnection } from 'nats';
import { Game, type gameInfo } from './classes/game.class.js';
import type { FastifyInstance } from 'fastify';

export async function initNatsConnexion(): Promise<NatsConnection> {
	let token: string | undefined = process.env.NATS_SERVER_TOKEN;
	if (!token)
		throw new Error("NATS token undefined");
	const nc = await connect({ servers: "nats://nats-server:4222", token: token});
	return (nc);
}

export async function natsSubscribtion(serv: FastifyInstance) {
	// const sc = StringCodec();

	// const sub = serv.nc.subscribe('game.start');
	// console.log(`Listening for messages on "game.start"...`);

	// (async () => {
	// 	for await (const msg of sub) {
	// 		const _gameInfo: gameInfo = JSON.parse(sc.decode(msg.data));
	// 		serv.gameRegistry.addGame(new Game(_gameInfo));
	// 		console.log(`Received message: ${JSON.stringify(_gameInfo)}`);
	// 		//TODO: send back a message saying the object was received
	// 	}
	// })();

	serv.gameRegistry.addGame(new Game(gameobj)); //TODO: for testing
};

import type { user } from './classes/game.class.js';
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
