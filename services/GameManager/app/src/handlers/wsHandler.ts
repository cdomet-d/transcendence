import type { FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { handleMatchRequest } from './manager.js';

export function wsHandler(socket: WebSocket, req: FastifyRequest): void {
	req.server.log.info('WebSocket connection established');

	socket.on('message', (message: string) => {
		// req.server.log.info(`server received: ${mess}`);
		
		const data: JSON = JSON.parse(message);
		handleMatchRequest(socket, data);
	});
}