import type { FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { processGameRequest } from '../manager.js';
import { addUserToLobby, createLobby } from './lobby.js';

export const wsClientsMap: Map<number, WebSocket> = new Map();

export function wsHandler(socket: WebSocket, req: FastifyRequest): void {
	req.server.log.info('WebSocket connection established');

	socket.on('message', (message: any) => {
		req.server.log.info(`server received: ${message}`);

		const data = JSON.parse(message);
		if (!data) {
			console.log("Error: Message received by GM is empty or corrupted!")
		}

		// FILTER BY EVENT
		const event = data.event;
		if (!event || event && (event !== "TOURNAMENT_REQUEST" && event !== "GAME_REQUEST" && event !== "LOBBY_REQUEST")) {
			console.log("Error: Wrong or empty request received in GM!");
			return;
		}

		// PAYLOAD MAY BE lobbyInfo OR lobbyForm
		const payload/* : lobbyInfo  */ = data.payload;
		if (!payload) {
			console.log("Error: payload received by GM is empty!");
			return;
		}

		if (event === "TOURNAMENT_REQUEST") {
			processGameRequest(payload);
		} else if (event === "GAME_REQUEST") {
			// TODO
		} else if (event === "LOBBY_REQUEST") {

			const userID = getUniqueUserID(); // HAHAHA this bad but no choice
			const action: string = payload.action;
			if (!action) {
				console.log("Error: GM received data but not data.action!");
				return;
			}

			console.log(`GM received: ${action}`);

			wsClientsMap.set(userID, socket);
			req.server.log.info("User" + userID + " added to clientMap");
			if (action === "create") {
				createLobby(userID);
				wsSend(socket, JSON.stringify({ lobby: "created" }));
			} else if (action === "join") {
				// addUserToLobby(userID, lobbyID); // TODO: replace lobbyID with one given in invitation
				wsSend(socket, JSON.stringify({ lobby: "joined" }));
			}
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
		// TODO: handle this error 
	}
}

// Need mutex or DB for safety
let idIndex: number = 1;

function getUniqueUserID(): number {
	const uniqueID = idIndex++;
	return uniqueID;
}