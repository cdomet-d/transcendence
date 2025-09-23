import { connect, StringCodec, type NatsConnection } from 'nats';
import { Game } from './classes/game.class.js';
import type { gameInfo } from './classes/game.class.js'
import type { FastifyInstance } from 'fastify';

export async function initNatsConnexion(): Promise<NatsConnection> {
	let token: string | undefined = process.env.NATS_SERVER_TOKEN;
	if (!token)
		throw new Error("NATS token undefined");
	const nc = await connect({ servers: "nats://nats-server:4222", token: token});
	return (nc);
}

export async function natsSubscribtion(serv: FastifyInstance) {
	const sc = StringCodec();

	const sub = serv.nc.subscribe('game.start');
	(async () => {
		for await (const msg of sub) {
			const _gameInfo: gameInfo = JSON.parse(sc.decode(msg.data));
			serv.gameRegistry.addGame(new Game(_gameInfo));
			console.log(`Received message: ${JSON.stringify(_gameInfo)}`);
			//TODO: send back a message saying the object was received
		}
	})();

	console.log(`Listening for messages on "game.start"...`);
};

/*
const player1: user = {
	username: "cha",
	userID: 1
}

const player2: user = {
	username: "sweet",
	userID: 2
}

const gameobj: game = {
	matchID: 1,
	score: [],
	local: true,
	users: [player1, player2],
	winner: "",
	loser: ""
}
*/