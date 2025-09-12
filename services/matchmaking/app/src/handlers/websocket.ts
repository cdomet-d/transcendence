import type { FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { handleQuickMatch } from './quickMatch.js';

function wshandler(socket: WebSocket, req: FastifyRequest): void {
	req.server.log.info('WebSocket connection established');

	socket.on('message', (payload: any) => {
		const mess: string = payload.toString();
		req.server.log.info(`client sent: ${mess}`);
		if (mess.match("create 1vs1"))
			handleQuickMatch(socket, mess, req);
	});
}

export { wshandler };
