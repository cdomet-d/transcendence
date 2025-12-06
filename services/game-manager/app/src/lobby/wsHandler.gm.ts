import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { processGameRequest } from '../gameManager/gameManager.js';
import { wsClientsMap, addUserToLobby, createLobby, lobbyMap, removeUserFromLobby, addUserToWhitelist, removeUserFromWhitelist, findLobbyIDFromUserID } from './lobby.gm.js';
import { validateData, validatePayload } from '../gameManager/inputValidation.js';
import type { lobbyInfo } from '../gameManager/gameManager.interface.js';
import type { lobbyRequestForm, gameNotif, lobbyInviteForm } from './lobby.interface.js';
import { natsPublish } from '../nats/publisher.gm.js';

export function wsHandler(this: FastifyInstance, socket: WebSocket, req: FastifyRequest): void {
	let userID: string | null = null;

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

				userID = lobbyPayload.userID;
				let username: string = lobbyPayload.username;
				console.log('lobbyHost UID: ', userID);

				if (!wsClientsMap.has(userID!) && lobbyPayload.action !== 'invite') {
					wsClientsMap.set(userID!, socket);
				}

				if (lobbyPayload.action === 'create') {
					const newLobby: lobbyInfo = createLobby({userID: userID!, username: username }, lobbyPayload.format!);
					this.log.error(`FORM IN GM CREATE: ${formInstance}`);
					wsSend(socket, JSON.stringify({ lobby: 'created', lobbyID: newLobby.lobbyID, formInstance: formInstance }))
				}
				return;
			}

			if (data.event === 'GAME_REQUEST') {
				const gamePayload = payload as lobbyInfo;
				processGameRequest(this, gamePayload);
				return;
			}

			if (data.event === 'LOBBY_INVITE') {

				const invitePayload = payload as lobbyInviteForm;
				const hostID = invitePayload.hostID;
				console.log('HOST ID:', hostID);

				if (invitePayload.action === 'invite') {
					const inviteeID = invitePayload.inviteeID!;
					const lobbyID: string | null = findLobbyIDFromUserID(invitePayload.hostID!);
					if (lobbyID === null) {
						wsSend(socket, JSON.stringify({ error: 'lobby not found' }));
						return;
					}
					console.log('LOBBY ID:', lobbyID);
					const hostUsername: string = lobbyMap.get(lobbyID)?.userList.get(invitePayload.hostID!)?.username!; //TODO: check if it exists ? normally it always should
					const notif: gameNotif = {
						type: 'GAME_INVITE',
						senderUsername: hostUsername,//TODO
						receiverID: inviteeID,
						lobbyID: lobbyID!,
						gameType: formInstance === 'remoteForm' ? '1 vs 1' : 'tournament'
					};
					console.log('inviteeID: ', inviteeID);
					addUserToWhitelist(inviteeID, lobbyID!);
					natsPublish(this, 'post.notif', JSON.stringify(notif));
				} else if (invitePayload.action === 'decline') {
					const inviteeID = invitePayload.inviteeID!;
					removeUserFromWhitelist(inviteeID, invitePayload.lobbyID!);

				} else if (invitePayload.action === 'join') {
					this.log.error(`IN JOIN + ${formInstance}`);
					addUserToLobby(userID!, socket, invitePayload.lobbyID!);
					wsSend(socket, JSON.stringify({ lobby: 'joined', lobbyID: invitePayload.lobbyID, formInstance: formInstance }));
					//TODO: send start to host
				}
			}
		} catch (error) {
			req.server.log.error(`Malformed WS message: ${error}`);
		}
	});

	socket.on('close', () => {
		if (userID !== null) {
			let lobbyID: string | null = findLobbyIDFromUserID(userID);
			if (lobbyID !== null)
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