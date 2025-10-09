import type { FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { processLobbyRequest } from '../manager.js';
import type { lobbyInfo } from '../manager.js'

export const wsClientsMap: Map<Number, WebSocket> = new Map();

export function wsHandler(socket: WebSocket, req: FastifyRequest): void {
	req.server.log.info('WebSocket connection established');

	const userID = getUniqueUserID();
	wsClientsMap.set(userID, socket);
	req.server.log.info("User" + userID + " added to clientMap");

	// handle LOBBY creation CLIENT SIDE
		// room info
		// when they're sent (ex: Friend joins Lobby >> Others must see user appear in Lobby)
		// store user sockets until end of tournament (or match)
	
	// HERE handle info Lobby sends
		// new Lobby
		// user joined Lobby (UI + add client to wsClientsMap)
		// Tournament or Game request


	socket.on('message', (message: any) => {
		const data = JSON.parse(message);
		if (!data) {
			console.log("Error: Message received by GM is empty or corrupted!")
		}
		const event = data.event;
		if (!event || event && (event !== "TOURNAMENT_REQUEST" && event !== "GAME_REQUEST")) {
			console.log("Error: Wrong or empty request in GM!");
			return;
		}

		const payload: lobbyInfo = data.payload;
		if (!payload) {
			console.log("Error: lobbyInfo received by GM is empty!");
			return;
		}

		console.log("message event: ", event);
		console.log("1");
		if (event === "TOURNAMENT_REQUEST") {
			// req.server.log.info(`server received: ${mess}`);
			processLobbyRequest(data.payload);
		}
	});
}

// Need mutex or DB for safety
let idIndex: number = 1;

function getUniqueUserID(): number {
	const uniqueID = idIndex++;
	return uniqueID;
}

export function wsSend(userID: number, message: string): void {
    const ws = wsClientsMap.get(userID);
    if (ws && ws.readyState === ws.OPEN) {
        ws.send(message);
    } else {
        console.log(`Connection for user ${userID} not found or not open.`);
		// handle this error 
    }
}