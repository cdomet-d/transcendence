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

/* 
export function wsHandler(this: FastifyInstance, socket: WebSocket, req: FastifyRequest): void {
	let authenticatedUserID: string;
	let authenticatedUsername: string;

	const origin = req.headers.origin;
	const allowedOrigins = ['https://localhost:8443'];

	if (origin && !allowedOrigins.includes(origin)) {
		req.server.log.warn(`Rejected WS connection from invalid origin: ${origin}`);
		socket.close(1008, 'Invalid origin');
		return;
	}

	try {
		const token = req.cookies?.token || req.cookies?.accessToken;

		if (!token) {
			req.server.log.warn('WebSocket connection attempt without authentication token');
			socket.close(1008, 'Authentication required');
			return;
		}

		const decoded = this.jwt.verify<JWTPayload>(token);

		authenticatedUserID = decoded.userId;
		authenticatedUsername = decoded.username;

		req.server.log.info(`Authenticated WebSocket connection for user: ${authenticatedUserID}`);

	} catch (error) {
		req.server.log.warn(`Invalid JWT token in WebSocket connection: ${error}`);
		socket.close(1008, 'Invalid authentication token');
		return;
	}

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

			if (data.event === 'LOBBY_REQUEST') {
				const lobbyPayload = payload as lobbyRequestForm;

				if (lobbyPayload.userID && lobbyPayload.userID !== authenticatedUserID) {
					req.server.log.warn(`UserID mismatch: payload=${lobbyPayload.userID}, authenticated=${authenticatedUserID}`);
					wsSend(socket, JSON.stringify({ error: 'user mismatch' }));
					socket.close(1008, 'Unauthorized');
					return;
				}

				const userID = authenticatedUserID;
				const username = authenticatedUsername;

				if (lobbyPayload.action === 'create') {
					let lobbyID: string | null = findLobbyIDFromUserID(userID);
					if (lobbyID !== null)
						removeUserFromLobby(userID, lobbyID);
					const newLobby: lobbyInfo = createLobby({ userID: userID, username: username, userSocket: socket }, lobbyPayload.format!);
					wsSend(socket, JSON.stringify({ lobby: 'created', lobbyID: newLobby.lobbyID, formInstance: formInstance }))
				}
				return;
			}

			if (data.event === 'GAME_REQUEST') {
				const gamePayload = payload as lobbyInfo;

				if (gamePayload.hostID !== authenticatedUserID) {
					req.server.log.warn(`Unauthorized game start attempt by ${authenticatedUserID}`);
					wsSend(socket, JSON.stringify({ error: 'not lobby host' }));
					return;
				}

				if (findLobbyIDFromUserID(authenticatedUserID) === null) {
					wsSend(socket, JSON.stringify({ error: 'user not in lobby' }));
					// close ws?
					return;
				}

				if (processGameRequest(this, gamePayload) === false) {
					req.server.log.error("processGameRequest failed: not enough players");
					wsSend(socket, JSON.stringify({ error: 'not enough players' }));
				}
				return;
			}

			if (data.event === 'LOBBY_INVITE') {
				const invitePayload = payload as lobbyInviteForm;

				if (invitePayload.action === 'invite') {
					const inviteeID = invitePayload.invitee.userID!;

					if (invitePayload.hostID !== authenticatedUserID) {
						req.server.log.warn(`Unauthorized invite attempt by ${authenticatedUserID}`);
						wsSend(socket, JSON.stringify({ error: 'not lobby host' }));
						return;
					}

					const lobbyID: string | null = findLobbyIDFromUserID(authenticatedUserID);
					if (lobbyID === null) {
						wsSend(socket, JSON.stringify({ error: 'lobby not found' }));
						return;
					}

					const hostUsername: string = lobbyMap.get(lobbyID)?.userList.get(authenticatedUserID)?.username!;
					const notif: gameNotif = {
						type: 'GAME_INVITE',
						senderUsername: hostUsername,
						receiverID: inviteeID,
						lobbyID: lobbyID!,
						gameType: formInstance === 'remoteForm' ? '1 vs 1' : 'tournament'
					};
					addNotifToDB(this, notif);
					addUserToWhitelist(invitePayload.invitee, lobbyID!);
					natsPublish(this, 'post.notif', JSON.stringify(notif));

				} else if (invitePayload.action === 'decline') {
					const inviteeID = invitePayload.invitee.userID!;

					if (inviteeID !== authenticatedUserID) {
						req.server.log.warn(`User ${authenticatedUserID} tried to decline invite for ${inviteeID}`);
						wsSend(socket, JSON.stringify({ error: 'Unauthorized' }));
						return;
					}

					removeNotifFromDB(this, invitePayload.lobbyID!, authenticatedUserID);
					removeUserFromWhitelist(authenticatedUserID, invitePayload.lobbyID!);
					if (findLobbyIDFromUserID(authenticatedUserID) === null)
						socket.close();

				} else if (invitePayload.action === 'join') {
					if (invitePayload.invitee.userID !== authenticatedUserID) {
						req.server.log.warn(`User ${authenticatedUserID} tried to join as ${invitePayload.invitee.userID}`);
						wsSend(socket, JSON.stringify({ error: 'Unauthorized' }));
						return;
					}

					if (!lobbyMap.has(invitePayload.lobbyID!)) {
						wsSend(socket, JSON.stringify({ error: 'lobby does not exist' }));
						return;
					}

					let oldLobby: string | null = findLobbyIDFromUserID(authenticatedUserID);
					if (oldLobby !== null)
						removeUserFromLobby(authenticatedUserID, oldLobby);

					removeNotifFromDB(this, invitePayload.lobbyID!, authenticatedUserID);
					addUserToLobby(authenticatedUserID, authenticatedUsername, socket, invitePayload.lobbyID!);
					const whiteListUsernames: string[] = getWhiteListUsernames(invitePayload.lobbyID!);

					wsSend(socket, JSON.stringify({
						lobby: 'joined',
						lobbyID: invitePayload.lobbyID,
						formInstance: formInstance,
						whiteListUsernames: whiteListUsernames
					}));
				}
			}
		} catch (error) {
			req.server.log.error(`Malformed WS message: ${error}`);
			wsSend(socket, JSON.stringify({ error: 'Invalid message format' }));
		}
	});

	socket.on('close', () => {
		req.server.log.info(`WebSocket closed for user: ${authenticatedUserID}`);

		let lobbyID: string | null = findLobbyIDFromUserID(authenticatedUserID);
		if (lobbyID !== null)
			removeUserFromLobby(authenticatedUserID, lobbyID);
		wsClientsMap.delete(authenticatedUserID);
	});
}
*/