import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { Player } from "../classes/player.class.js";
import type { Game } from '../classes/game.class.js';
import { setUpGame } from './pong.js';
import type { GameRegistry } from '../classes/gameRegistry.class.js';

interface idsObj {
	gameID: number,
	userID: number
}

function wsHandler(this: FastifyInstance, socket: WebSocket, req: FastifyRequest): void {
	this.log.info('WebSocket connection established');
	
	let gameRef = { game: undefined as Game | undefined };

	const messHandler = createMessHandler(this.gameRegistry, gameRef, socket);
	socket.once('message', messHandler)

	socket.on('close', () => {
		if (gameRef.game)
			gameRef.game.deletePlayers(); //TODO: to be rm
		//TODO: delete game ? need to know if everything is done
	});
}

function createMessHandler(gameRegistry: GameRegistry, ref: { game: Game | undefined }, socket: WebSocket) {
	return (payload: string) => {
		const ids: idsObj = JSON.parse(payload);
		if (Number.isNaN(ids.gameID) || Number.isNaN(ids.userID))
			throw new Error("wrong ID");

		ref.game = gameRegistry.findGame(ids.gameID);
		if (!ref.game)
			throw new Error("game not found"); //TODO: send nats message ?
		if (ref.game.players.length === 2)
			throw new Error("not allowed");

		getPlayersInGame(ref.game, ids.userID, socket);
	}
}

function getPlayersInGame(game: Game, userID: number, socket: WebSocket) {
	game.addPlayer(new Player(userID, socket, false));
	if (game.local)
		game.addPlayer(new Player(game.randUserID, socket, true));
	if (game.players.length === 2)
		setUpGame(game);
}

export { wsHandler as wshandler };
