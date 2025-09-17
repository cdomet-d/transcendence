import type { FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { paddlePos } from './pong.js';

/*
match:
	-   matchID
	-   score
	-   local: bool
	-   users[]:
		-   user1:
			-   username
			-   userID
		-   user2:
			-   username
			-   userID
	-   winner
	-   loser
*/

function wshandler(socket: WebSocket, req: FastifyRequest): void {
	req.server.log.info('WebSocket connection established');

	socket.on('message', (payload: any) => {
		const mess: string = payload.toString();
		req.server.log.info(`client sent: ${mess}`);
		if (mess.match("Pad:"))
			paddlePos(socket, mess);
	});
}

export { wshandler };