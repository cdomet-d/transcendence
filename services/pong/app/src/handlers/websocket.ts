import type { FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import type { FastifyInstance } from 'fastify';
import type { Game } from "../classes/game.class.js";
import { setUpGame } from './pong.js';

function wshandler(this: FastifyInstance, socket: WebSocket, req: FastifyRequest): void {
	this.log.info('WebSocket connection established');

	socket.on('open', () => {
		const GameIdCookie: string | undefined = req.cookies.gameid;
		const UserIdCookie: string | undefined = req.cookies.userid;

		const userID: number = Number(UserIdCookie);
		const gameID: number = Number(GameIdCookie);
		if (Number.isNaN(gameID) || Number.isNaN(userID))
			throw new Error("wrong gameID"); //TODO: catch error

		const game: Game | undefined = this.gameRegistry.findGame(gameID);
		if (!game) 
			throw new Error("game not found"); //TODO: send nats message ?

		if (game.sockets.size === 2) {
			socket.close();
			throw new Error("not allowed");
		}
		game.addUserSocket(userID, socket);

		if (game.local || game.sockets.size === 2)
			setUpGame();
	});

	socket.on('close', () => {
		//TODO: delete game ? need to know if every thing is done
	});
}

export { wshandler };

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
