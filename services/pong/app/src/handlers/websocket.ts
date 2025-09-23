import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { Player } from "../classes/player.class.js";
import type { Game } from '../classes/game.class.js';
import { setUpGame } from './pong.js';

function wshandler(this: FastifyInstance, socket: WebSocket, req: FastifyRequest): void {
	this.log.info('WebSocket connection established');
	const GameIdCookie: string | undefined = req.cookies.gameid;
	const UserIdCookie: string | undefined = req.cookies.userid;

	const userID: number = Number(UserIdCookie);
	const gameID: number = Number(GameIdCookie);
	if (Number.isNaN(gameID) || Number.isNaN(userID))
		throw new Error("wrong ID"); //TODO: catch error

	const game: Game | undefined = this.gameRegistry.findGame(gameID);
	if (!game) 
		throw new Error("game not found"); //TODO: send nats message ?

	if (game.players.length === 2) {
		// socket.close();
		throw new Error("not allowed"); //errorHandler should be called
	}

	game.addPlayer(new Player(userID, socket));
	if (game.local) {
		const randUserIdCookie: string | undefined = req.cookies.randuserid;
		const randUserId: number = Number(randUserIdCookie);
		if (Number.isNaN(randUserId))
			throw new Error("wrong ID");
		game.addPlayer(new Player(randUserId, socket));
	}
	
	if (game.players.length === 2)
		setUpGame(game);

	socket.on('close', () => {
		game.deletePlayers(); //TODO: to be rm
		//TODO: delete game ? need to know if everything is done
	});
}

export { wshandler };


