import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import type { Game } from '../classes/game.class.js';
import { setUpGame } from './pong.js';
import { validIds, type idsObj } from './mess.validation.js';
import { natsSubscription } from '../nats/subscriber.js';//only for testing

export async function wsHandler(this: FastifyInstance, socket: WebSocket, req: FastifyRequest): Promise< void > {
	this.log.info('PONG webSocket connection established');

	const ids: idsObj = await waitForMessage(socket);

	const game: Game | undefined = this.gameRegistry.findGame(ids.gameID);
	if (!game)
		throw new Error("game " + ids.gameID + " not found"); //TODO: send nats message ?
	if (game.players.length === 2)
		throw new Error("not allowed");

	getPlayerInGame(game, ids.userID, socket);
	
	// socket.onerror = (event) => {}; //TODO

	socket.on('close', () => {
		if (game) {
			game.cleanTimeoutIDs();
			game.deletePlayers();
			this.gameRegistry.deleteGame(game.gameID);
			// natsSubscription(this); //only for testing
		}
	});
}

export function waitForMessage(socket: WebSocket): Promise<idsObj> {
	return new Promise((resolve, reject) => {
		socket.once('message', (payload: string) => {
			try {
				const ids = JSON.parse(payload);
				if (!validIds(ids))
					reject(new Error("Invalid ids"));
				resolve(ids);
			} catch (err) {
				reject(err);
			}
		});
	});
}

function getPlayerInGame(game: Game, userID: number, socket: WebSocket) {
	game.addPlayer(userID, socket, "left");
	if (game.local)
		game.addPlayer(game.randUserID, socket, "right");
	if (game.players.length === 2)
		setUpGame(game);
}
