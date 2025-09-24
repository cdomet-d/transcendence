// import type { FastifyRequest } from 'fastify';
// import type { WebSocket } from '@fastify/websocket';
// import { handleMatchRequest } from './manager.js';

// let socketTmp: WebSocket | undefined;

// export function wsHandler(socket: WebSocket, req: FastifyRequest): void {
// 	req.server.log.info('WebSocket connection established');

// 	if (!socketTmp)
// 		socketTmp = socket;

// 	socket.on('message', (message: any) => {

// 		const data = JSON.parse(message);
// 		console.log("MESSAGE.EVENT: ", data.event);
// 		if (data.event === "GAME_REQUEST_FORM") {
// 			// req.server.log.info(`server received: ${mess}`);
			
// 			console.log("2");
// 			console.log("ws msg received by GM\n\n");
// 			handleMatchRequest(socket, data);
// 		}

// 	});
// }

// export function sendWS(payload: any) {
// 	socketTmp.send(payload);
// }

import type { FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { handleMatchRequest } from './manager.js';

const connections: Map<Number, WebSocket> = new Map();

export function wsHandler(socket: WebSocket, req: FastifyRequest): void {
	req.server.log.info('WebSocket connection established');
	
	socket.on('message', (message: any) => {

		const data = JSON.parse(message);
		if (!data.payload.userID) {
			console.log("Missing UserID in object sent by FRONT to GameManager: ", data.payload.userID);
			return;
		}

		const userID = data.payload.userID;
		// if (connections.has(userID)) {
		// 	connections.get(userID).close();
		// }
		connections.set(userID, socket);

		console.log("MESSAGE.EVENT: ", data.event);
		if (data.event === "GAME_REQUEST_FORM") {
			// req.server.log.info(`server received: ${mess}`);
			
			console.log("2");
			console.log("ws msg received by GM\n\n");
			handleMatchRequest(data);
		}
	});
}

export function sendWS(userID: Number, payload: any) {
	// associate userID to its socket
	// send "payload" to that socket
	const userSocket = connections.get(userID);
	if (!userSocket) {
		console.log("Error: user socket not found in GM userMap");
		return;
	}
    // console.log("ITS SOCKET ", userSocket);

	console.log("INSIDE sendWS");
	console.log("payload: ", payload);
	if (userSocket.readyState === WebSocket.OPEN)
		userSocket.send(payload);
}