import type { FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { handleMatchRequest } from './manager.js';

export function wsHandler(socket: WebSocket, req: FastifyRequest): void {
	req.server.log.info('WebSocket connection established');

	socket.on('message', (payload: string) => {
		// const mess: string = payload.toString();
		// req.server.log.info(`server received: ${mess}`);
		// const message = JSON.parse(payload);
		const message = '{ "format": "quickMatch", "remote": "false", "players": "2", "userID": "1", "username": "sam" }';
		
		handleMatchRequest(socket, message);
	});
}