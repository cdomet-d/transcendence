import type { FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { handleMatchRequest } from './manager.js';

let socketTmp: WebSocket | undefined;

export function wsHandler(socket: WebSocket, req: FastifyRequest): void {
	req.server.log.info('WebSocket connection established');

	if (!socketTmp)
		socketTmp = socket;

	socket.on('message', (message: any) => {

		const data = JSON.parse(message);
		console.log("MESSAGE.EVENT: ", data.event);
		if (data.event === "GAME_REQUEST_FORM") {
			// req.server.log.info(`server received: ${mess}`);
			
			console.log("2");
			console.log("ws msg received by GM\n\n");
			handleMatchRequest(socket, data);
		}

	});
}

export function sendWS(payload: any) {
	socketTmp.send(payload);
}