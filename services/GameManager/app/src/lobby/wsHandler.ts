import type { FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { startTournament } from '../tournament/tournament.state.js';

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

const wsConnections: Map<Number, WebSocket> = new Map();

export function wsHandler(socket: WebSocket, req: FastifyRequest): void {
	req.server.log.info('WebSocket connection established');
	
	// handle LOBBY creation CLIENT SIDE
		// room info
		// when they're sent (ex: Friend joins Lobby >> Others must see user appear in Lobby)
	
	// HERE handle info Lobby sends
		// new Lobby
		// user joined Lobby (UI + add client to wsConnections)
		// Tournament or Game request
	socket.on('message', (message: any) => {
		const data = JSON.parse(message);
		if (!data.payload.users[0].userID) {
			console.log("Missing UserID in object sent by FRONT to GM: ");
			return;
		}
		const hostID = data.payload.users[0].userID;
		console.log("hostID: ", hostID);
		wsConnections.set(hostID, socket);

		console.log("MESSAGE.EVENT: ", data.event);
		if (data.event === "TOURNAMENT_REQUEST") {
			// req.server.log.info(`server received: ${mess}`);
			startTournament(data);
		}
	});
}
