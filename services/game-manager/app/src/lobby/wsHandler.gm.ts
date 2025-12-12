import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { wsClientsMap, lobbyMap, removeUserFromLobby, findLobbyIDFromUserID } from './lobby.gm.js';
import { validateData, validatePayload } from '../gameManager/inputValidation.gm.js';
import type { lobbyInfo } from '../gameManager/gameManager.interface.js';
import type { lobbyRequestForm, lobbyInviteForm } from './lobby.interface.js';
import { stopHandler } from '../tournament/tournamentStart.js';
import { handleGameRequest, handleLobbyInvite, handleLobbyRequest } from './wsRequests.gm.js';
import { authenticateConnection } from './wsUtils.gm.js';

export function wsHandler(this: FastifyInstance, socket: WebSocket, req: FastifyRequest) {
	const authResult = authenticateConnection(this, req, socket);
	if (!authResult) return;
	const { userID: authenticatedUserID, username: authenticatedUsername } = authResult;
	wsClientsMap.set(authenticatedUserID, socket);

	socket.on('message', (message: string) => {
		try {
			const data = JSON.parse(message);
			if (!validateData(data, this, socket)) throw new Error("invalid input");
			const { payload } = data;
			if (!validatePayload(data, payload, this, socket)) throw new Error("invalid input");

			if (data.event === 'NOTIF' && payload.notif === 'ping') {
				socket.send(JSON.stringify({ event: 'NOTIF', notif: 'pong' }));
				return;
			}

			if (data.event === 'BAD_USER_TOKEN') throw new Error("invalid token");

			switch (data.event) {
				case 'LOBBY_REQUEST':
					handleLobbyRequest(payload as lobbyRequestForm, authenticatedUserID, authenticatedUsername, socket, req);
					break;
				case 'GAME_REQUEST':
					handleGameRequest(this, payload as lobbyInfo, authenticatedUserID, socket, req);
					break;
				case 'LOBBY_INVITE':
					handleLobbyInvite(this, payload as lobbyInviteForm, authenticatedUserID, authenticatedUsername, socket, req);
					break;
			}
		} catch (error) {
			socket.close(1003, `Malformed WS message`);
			req.server.log.error(`Malformed WS message: ${error}`);
			wsSend(socket, JSON.stringify({ error: 'Invalid message format' }));
		}
	});

	socket.onclose = (ev: any) => {
		if (authenticatedUserID !== null) {
			let lobbyID: string | undefined = findLobbyIDFromUserID(authenticatedUserID);
			if (lobbyID !== undefined)
				removeUserFromLobby(authenticatedUserID, lobbyID, ev.code);
			wsClientsMap.delete(authenticatedUserID);
		}
	};
}

export function wsSend(ws: WebSocket, message: string): void {
	if (ws && ws.readyState === ws.OPEN) {
		ws.send(message);
	} else {
		const payload = JSON.parse(message);
		console.log(`Error: Connection for userID < ${payload.userID} > not found or not open...`);
	}
}

export let hostStartHandler: (message: string) => void;
export function informHostToStart(serv: FastifyInstance, socket: WebSocket, lobbyID: string) {
	hostStartHandler = (message: string) => {
		try {
			const data = JSON.parse(message);
			if (!validateData(data, serv, socket)) throw new Error("invalid input");
			if (!validatePayload(data, data.payload, serv, socket)) throw new Error("invalid input");
			if (data.payload.signal === 'in lobby') {
				const lobby: lobbyInfo = lobbyMap.get(lobbyID)!;
				if (lobby.nbPlayers === lobby.userList.size) {
					const hostSocket: WebSocket = lobby.userList.get(lobby.hostID!)?.userSocket!;
					wsSend(hostSocket, JSON.stringify("start"));
				}
				stopHandler(hostStartHandler, socket);
			}
		} catch (err: any) {
			socket.close(1003, "Invalid input");
			serv.log.error(err.message);
		}
	}
	socket.on('message', hostStartHandler);
}
