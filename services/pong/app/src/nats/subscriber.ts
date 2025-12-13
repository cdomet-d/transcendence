import { connect, StringCodec, type NatsConnection } from 'nats';
import { natsPublish } from './publisher.js'
import { Game } from '../classes/game-class.js';
import type { FastifyInstance } from 'fastify';
import type { gameInfo, gameReply } from '../classes/game-interfaces.js';

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

	(async () => {
		for await (const msg of sub) {
			const gameInfo: gameInfo = JSON.parse(sc.decode(msg.data));
			console.log("game id", gameInfo.gameID)
			console.log("remote", gameInfo.remote)

			serv.gameRegistry.addGame(new Game(gameInfo, serv.nc, serv.log));

			if (msg.reply) {
				const gameReply: gameReply = {
					lobbyID: gameInfo.lobbyID,
					gameID: gameInfo.gameID,
					users: gameInfo.users,
					remote: gameInfo.remote,
					gameSettings: gameInfo.gameSettings,
				}
				natsPublish(serv.nc, msg.reply, JSON.stringify(gameReply));
			}
		}
	})();

};
