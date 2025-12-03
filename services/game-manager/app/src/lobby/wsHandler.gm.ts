import type { lobbyInfo } from '../manager.interface.js';
import { processGameRequest } from '../manager.js';
import { wsClientsMap, addUserToLobby, createLobby, lobbyMap, removeUserFromLobby } from './lobby.gm.js';
import type { FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';

export function wsHandler(socket: WebSocket, req: FastifyRequest): void {
	let userID: string | null = null;

	socket.on('message', (message: string) => {
		try {
			const data = JSON.parse(message);
			if (data.event === "BAD_USER_TOKEN") return;

			const { payload, formInstance } = data;

			if (data.event === "LOBBY_REQUEST") {
				userID = payload.userID;
				console.log("lobbyHost UID: ", userID);

				if (!wsClientsMap.has(userID!)) {
					wsClientsMap.set(userID!, socket);
				}

				if (payload.action === "create") {
					const newLobby: lobbyInfo = createLobby(userID!, payload.format);
					socket.send(JSON.stringify({ lobby: "created", lobbyID: newLobby.lobbyID, formInstance: formInstance }));
				} else if (payload.action === "join") {
					addUserToLobby(userID!, socket, payload.lobbyID);
					socket.send(JSON.stringify({ lobby: "joined", lobbyID: payload.lobbyID }));
				}
			} else if (data.event === "GAME_REQUEST") {
				processGameRequest(payload);
			}
		} catch (error) {
			req.server.log.error(`Malformed WS message: ${error}`);
		}
	});

	socket.on('close', () => {
		if (userID !== null) {
			let lobbyID: string | undefined = undefined;

			for (const [_, lobbyInfo] of lobbyMap.entries()) {
				if (lobbyInfo.userList.has(userID)) {
					lobbyID = lobbyInfo.lobbyID;
					break;
				}
			}
			if (lobbyID !== undefined)
				removeUserFromLobby(userID, lobbyID);
		}
	});
}

export function wsSend(ws: WebSocket, message: string): void {
	if (ws && ws.readyState === ws.OPEN) {
		ws.send(message);
	} else {
		const payload = JSON.parse(message);
		console.log(`Error: Connection for userID < ${payload.userID} > not found or not open...`);
		console.log(`\tCould not start game with gameID < ${payload.gameID} > `);
	}
}