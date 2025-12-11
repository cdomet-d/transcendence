import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { wsClientsMap } from './lobby.gm.js';
import { validateData, validatePayload } from '../gameManager/inputValidation.gm.js';
import type { lobbyInfo } from '../gameManager/gameManager.interface.js';
import type { lobbyRequestForm, lobbyInviteForm } from './lobby.interface.js';
import { authenticateConnection, handleClose, validateOrigin } from './wsUtils.gm.js';
import { handleGameRequest, handleLobbyInvite, handleLobbyRequest } from './wsRequests.gm.js';

export function wsHandler(this: FastifyInstance, socket: WebSocket, req: FastifyRequest): void {
	if (!validateOrigin(req.headers.origin, req, socket)) {
		return;
	}

	const authResult = authenticateConnection(this, req, socket);
	if (!authResult) {
		return;
	}

	const { userID: authenticatedUserID, username: authenticatedUsername } = authResult;
	wsClientsMap.set(authenticatedUserID, socket);

	socket.on('message', (message: string) => {
		try {
			const data = JSON.parse(message);
			if (!validateData(data, req, socket)) return;

			const { payload, formInstance } = data;
			if (!validatePayload(data, payload, req, socket)) return;

			if (data.event === 'NOTIF' && payload.notif === 'ping') {
				socket.send(JSON.stringify({ event: 'NOTIF', notif: 'pong' }));
				return;
			}

			if (data.event === 'BAD_USER_TOKEN') return;

			switch (data.event) {
				case 'LOBBY_REQUEST':
					handleLobbyRequest(payload as lobbyRequestForm, authenticatedUserID, authenticatedUsername, socket, formInstance, req);
					break;
				case 'GAME_REQUEST':
					handleGameRequest(this, payload as lobbyInfo, authenticatedUserID, socket, req);
					break;
				case 'LOBBY_INVITE':
					handleLobbyInvite(this, payload as lobbyInviteForm, authenticatedUserID, authenticatedUsername, formInstance, socket, req);
					break;
			}
		} catch (error) {
			req.server.log.error(`Malformed WS message: ${error}`);
			wsSend(socket, JSON.stringify({ error: 'Invalid message format' }));
		}
	});

	socket.on('close', () => handleClose(authenticatedUserID, req));
}

export function wsSend(ws: WebSocket, message: string): void {
	if (ws && ws.readyState === ws.OPEN) {
		ws.send(message);
	} else {
		console.log(`Error: WebSocket connection not open, could not send message`);
	}
}