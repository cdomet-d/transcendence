import type { FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { processLobbyRequest } from '../manager.js';

interface userInfo {
    userID: number,
    username: string
}

interface lobbyInfo {
    users: userInfo[],
    remote: boolean,
    format: "quick" | "tournament"
    // gameSettings: gameSettingsObj
}

const wsClientsMap: Map<Number, WebSocket> = new Map();

export function wsHandler(socket: WebSocket, req: FastifyRequest): void {
	req.server.log.info('WebSocket connection established');
	// handle LOBBY creation CLIENT SIDE
		// room info
		// when they're sent (ex: Friend joins Lobby >> Others must see user appear in Lobby)
	
	// HERE handle info Lobby sends
		// new Lobby
		// user joined Lobby (UI + add client to wsClientsMap)
		// Tournament or Game request
	socket.on('message', (message: any) => {
		const data = JSON.parse(message);
		if (!data.payload.users[0].userID) {
			console.log("Missing UserID in object sent by FRONT to GM: ");
			return;
		}
		const hostID = data.payload.users[0].userID;
		console.log("hostID: ", hostID);
		wsClientsMap.set(hostID, socket);

		console.log("MESSAGE.EVENT: ", data.event);
		if (data.event === "TOURNAMENT_REQUEST") {
			// req.server.log.info(`server received: ${mess}`);
			processLobbyRequest(data.payload);
		}
	});
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