import type { FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { handleTournamentRequest } from './lobby.js';

const connections: Map<Number, WebSocket> = new Map();

export function wsHandler(socket: WebSocket, req: FastifyRequest): void {
	req.server.log.info('WebSocket connection established');
	
	socket.on('message', (message: any) => {

		const data = JSON.parse(message);
		if (!data.payload.users[0].userID) {
			console.log("Missing UserID in object sent by FRONT to Lobby: ");
			return;
		}
		const hostID = data.payload.users[0].userID;
		console.log("hostID: ", hostID);
		connections.set(hostID, socket);

		console.log("MESSAGE.EVENT: ", data.event);
		if (data.event === "TOURNAMENT_REQUEST") {
			// req.server.log.info(`server received: ${mess}`);
			
			console.log("ws msg received by Lobby\n\n");
			handleTournamentRequest(data);
		}
	});
}
