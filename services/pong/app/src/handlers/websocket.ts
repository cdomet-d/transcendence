import type { FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { paddlePos } from './pong.js';
import type { FastifyInstance } from 'fastify';

function wshandler(this: FastifyInstance, socket: WebSocket, req: FastifyRequest): void {
	this.log.info('WebSocket connection established');
	this.log.info(`${Object.getPrototypeOf(this.gameRegistry.games)}`);

	socket.on('message', (payload: any) => {
		const mess: string = payload.toString();
		req.server.log.info(`client sent: ${mess}`);
		if (mess.match("Pad:"))
			paddlePos(socket, mess);
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
