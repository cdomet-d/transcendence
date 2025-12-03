import type { FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { processGameRequest } from '../gameManager/gameManager.js';
import { wsClientsMap, addUserToLobby, createLobby, lobbyMap, removeUserFromLobby, addUserToWhitelist, removeUserFromWhitelist } from './lobby.gm.js';
import { validateData, validatePayload } from '../gameManager/inputValidation.js';
import type { lobbyInfo } from '../gameManager/gameManager.interface.js';
import type { lobbyRequestForm } from './lobby.interface.js';

export function wsHandler(socket: WebSocket, req: FastifyRequest): void {
	let userID: string | null = null;

	socket.on('message', (message: string) => {
		try {
		console.log("3");

			const data = JSON.parse(message);
			if (!validateData(data, req, socket)) return;
		console.log("4");
		
		const { payload, formInstance } = data;
		if (!validatePayload(data, payload, req, socket)) return;
		console.log("5");

			if (data.event === "BAD_USER_TOKEN") return;

			if (data.event === "LOBBY_REQUEST") {
				const lobbyPayload = payload as lobbyRequestForm;

				userID = lobbyPayload.userID;
				console.log("lobbyHost UID: ", userID);

				if (!wsClientsMap.has(userID!) && lobbyPayload.action !== "invite") {
					wsClientsMap.set(userID!, socket);
				}

				if (lobbyPayload.action === "create") {
					const newLobby: lobbyInfo = createLobby(userID!, lobbyPayload.format);
					wsSend(socket, JSON.stringify({ lobby: "created", lobbyID: newLobby.lobbyID, formInstance: formInstance }))
				} else if (lobbyPayload.action === "invite") {
					const inviteeID = lobbyPayload.inviteeID!;
					addUserToWhitelist(inviteeID, lobbyPayload.lobbyID!);
				} else if (lobbyPayload.action === "decline") {
					const inviteeID = lobbyPayload.inviteeID!;
					removeUserFromWhitelist(inviteeID, lobbyPayload.lobbyID!);
				} else if (lobbyPayload.action === "join") {
					addUserToLobby(userID!, socket, lobbyPayload.lobbyID!);
					wsSend(socket, JSON.stringify({ lobby: "joined", lobbyID: lobbyPayload.lobbyID }));
				}
			} else if (data.event === "GAME_REQUEST") {
				const gamePayload = payload as lobbyInfo;
				processGameRequest(gamePayload);
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