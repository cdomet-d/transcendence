import type { FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { processLobbyGameRequest } from '../manager.js';
import type { lobbyInfo } from '../manager.js'
import { createLobby } from './lobby.js';

export const wsClientsMap: Map<number, WebSocket> = new Map();

export function wsHandler(socket: WebSocket, req: FastifyRequest): void {
	req.server.log.info('WebSocket connection established');

	// const userID = getUniqueUserID();
	// wsClientsMap.set(userID, socket);
	// req.server.log.info("User" + userID + " added to clientMap");

	// // IF CREATE LOBBY
	// createLobby(userID);

	// // IF JOIN LOBBY



	// handle LOBBY creation CLIENT SIDE
	// room info
	// when they're sent (ex: Friend joins Lobby >> Others must see user appear in Lobby)
	// store user sockets until end of tournament (or game)

	// HERE handle info Lobby sends
	// new Lobby
	// user joined Lobby (UI + add client to wsClientsMap)
	// Tournament or Game request


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

		// DIFFERENT PAYLOADS MAY COME (lobbyInfo OR lobbyForm)
		const payload/* : lobbyInfo  */ = data.payload;
		if (!payload) {
			console.log("Error: payload received by GM is empty!");
			return;
		}

		if (event === "TOURNAMENT_REQUEST") {
			processLobbyGameRequest(data.payload);
		} else if (event === "GAME_REQUEST") {
			// TODO
		} else if (event === "LOBBY_REQUEST") {
			const userID = getUniqueUserID(); // HAHAHA this bad but no choice
			if (payload.action) {
				if (payload.action === "create") { // createLobby()
					console.log("GM RECEIVED 'create'")
					wsClientsMap.set(userID, socket);
					req.server.log.info("User" + userID + " added to clientMap");
					createLobby(userID);
					wsSend(socket, JSON.stringify({ lobby: "created" }));
					return;
				} else if (payload.action === "join") { //joinLobby
					console.log("GM RECEIVED 'join'")
					wsClientsMap.set(userID, socket);
					req.server.log.info("User" + userID + " added to clientMap");
					joinLobby(userID);
					wsSend(socket, JSON.stringify({ lobby: "joined" }));
				}
			} else {
				console.log("Error: GM received data but not data.action!");
			}
		}

	});
}

// Need mutex or DB for safety
let idIndex: number = 1;

function getUniqueUserID(): number {
	const uniqueID = idIndex++;
	return uniqueID;
}

export function wsSend(ws: WebSocket, message: string): void {
	if (ws && ws.readyState === ws.OPEN) {
		ws.send(message);
	} else {
		const payload = JSON.parse(message);
		console.log(`Error: Connection for userID <${payload.userID}> not found or not open...`);
		console.log(`\tCould not start game with gameID <${payload.gameID}>`);
		// handle this error 
	}
}