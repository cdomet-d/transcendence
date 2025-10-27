import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { Player } from "../classes/player.class.js";
import type { Game } from '../classes/game.class.js';
import { setUpGame } from './pong.js';
import { validIds, type idsObj } from './mess.validation.js';
import { natsSubscribtion } from '../subscriber.js';//only for testing

async function wsHandler(this: FastifyInstance, socket: WebSocket, req: FastifyRequest): Promise< void > {
	this.log.info('WebSocket connection established');

	const ids: idsObj = await waitForMessage(socket);

	const game: Game | undefined = this.gameRegistry.findGame(ids.gameID);
	if (!game) 
		throw new Error("game " + ids.gameID + " not found"); //TODO: send nats message ?
	if (game.players.length === 2)
		throw new Error("not allowed");

	getPlayersInGame(game, ids.userID, socket);
	
	socket.on('close', () => {
		if (game.timeoutID)
			clearTimeout(game.timeoutID);
		if (game)
			game.deletePlayers(); //TODO: to be rm
		this.gameRegistry.deleteGame(game.gameID);
		natsSubscribtion(this); //only for testing
	});
}

export function waitForMessage(socket: WebSocket): Promise< idsObj > {
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

function getPlayersInGame(game: Game, userID: number, socket: WebSocket) {
	game.addPlayer(new Player(userID, socket, false));
	if (game.local)
		game.addPlayer(new Player(game.randUserID, socket, true));
	if (game.players.length === 2)
		setUpGame(game);
}

export { wsHandler };
