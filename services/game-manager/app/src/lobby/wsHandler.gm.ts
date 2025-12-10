import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { processGameRequest } from '../gameManager/gameManager.js';
import { wsClientsMap, addUserToLobby, createLobby, lobbyMap, removeUserFromLobby, addUserToWhitelist, removeUserFromWhitelist, findLobbyIDFromUserID, getWhiteListUsernames } from './lobby.gm.js';
import { validateData, validatePayload } from '../gameManager/inputValidation.gm.js';
import type { lobbyInfo, userInfo, whitelist } from '../gameManager/gameManager.interface.js';
import type { lobbyRequestForm, gameNotif, lobbyInviteForm } from './lobby.interface.js';
import { natsPublish } from '../nats/publisher.gm.js';
import { addNotifToDB, removeNotifFromDB } from '../inviteNotifs/invite-notifs.js';

export function wsHandler(this: FastifyInstance, socket: WebSocket, req: FastifyRequest) {
	let userID: string | null = null;

	socket.on('message', (message: string) => {
		try {
			const data = JSON.parse(message);
			if (!validateData(data, this, socket)) return;
			
			const { payload, formInstance } = data;
			if (!validatePayload(data, payload, this, socket)) return;

			if (data.event === 'NOTIF' && payload.notif === 'ping') {
				socket.send(JSON.stringify({ event: 'NOTIF', notif: 'pong' }));
				return;
			}

			if (data.event === 'BAD_USER_TOKEN') return;

			if (data.event === 'LOBBY_REQUEST') {
				const lobbyPayload = payload as lobbyRequestForm;

				userID = lobbyPayload.userID;
				let username: string = lobbyPayload.username;

				if (!wsClientsMap.has(userID!) && lobbyPayload.action !== 'invite') {
					wsClientsMap.set(userID!, socket);
				}

				if (lobbyPayload.action === 'create') {
					let lobbyID: string | null = findLobbyIDFromUserID(userID);
					if (lobbyID !== null)
						removeUserFromLobby(userID, lobbyID);
					const newLobby: lobbyInfo = createLobby({userID: userID!, username: username, userSocket: socket }, lobbyPayload.format!);
					wsSend(socket, JSON.stringify({ lobby: 'created', lobbyID: newLobby.lobbyID, formInstance: formInstance }))
				}
				return;
			}

			if (data.event === 'GAME_REQUEST') {
				const gamePayload = payload as lobbyInfo;

				if (processGameRequest(this, gamePayload) === false) {
					console.log("Error: bad processGameRequest!");
					wsSend(socket, JSON.stringify({ error: 'not enough players' }));
				}
				return;
			}

			if (data.event === 'LOBBY_INVITE') {
				const invitePayload = payload as lobbyInviteForm;

				if (invitePayload.action === 'invite') {
					const inviteeID = invitePayload.invitee.userID!;
					const lobbyID: string | null = findLobbyIDFromUserID(invitePayload.hostID!);
					if (lobbyID === null) {
						wsSend(socket, JSON.stringify({ error: 'lobby not found' }));
						return;
					}
					const hostUsername: string = lobbyMap.get(lobbyID)?.userList.get(invitePayload.hostID!)?.username!;
					const notif: gameNotif = {
						type: 'GAME_INVITE',
						senderUsername: hostUsername,//TODO
						receiverID: inviteeID,
						lobbyID: lobbyID!,
						gameType: payload.format! === 'quickmatch' ? '1 vs 1' : 'tournament'
					};
					this.log.error(`FORMA: ${payload.format}`);
					addNotifToDB(this, notif);
					// console.log('inviteeID: ', inviteeID);
					addUserToWhitelist(invitePayload.invitee, lobbyID!);
					natsPublish(this, 'post.notif', JSON.stringify(notif));
				} else if (invitePayload.action === 'decline') {
					const inviteeID = invitePayload.invitee.userID!;
					removeNotifFromDB(this, invitePayload.lobbyID!, inviteeID);
					removeUserFromWhitelist(inviteeID, invitePayload.lobbyID!);
					if (findLobbyIDFromUserID(inviteeID) === null)
						socket.close();
				} else if (invitePayload.action === 'join') {
					if (!lobbyMap.has(invitePayload.lobbyID!)) {
						wsSend(socket, JSON.stringify({ error: 'lobby does not exist' }));
					}
					userID = invitePayload.invitee.userID;
					let oldLobby: string | null = findLobbyIDFromUserID(userID);
					if (oldLobby !== null)
						removeUserFromLobby(userID, oldLobby);
					removeNotifFromDB(this, invitePayload.lobbyID!, userID);
					addUserToLobby(userID!, invitePayload.invitee.username!, socket, invitePayload.lobbyID!);
					const whiteListUsernames: string[] = getWhiteListUsernames(invitePayload.lobbyID!)
					wsSend(socket, JSON.stringify({ lobby: 'joined', lobbyID: invitePayload.lobbyID, formInstance: formInstance, whiteListUsernames: whiteListUsernames }));
					informHostToStart(this, req, socket, invitePayload.lobbyID!);
				}
			}
		} catch (error) {
			req.server.log.error(`Malformed WS message: ${error}`);
		}
	});

	socket.on('close', () => {
		console.log("CLOSE userID:", userID);
		if (userID !== null) {
			let lobbyID: string | null = findLobbyIDFromUserID(userID);
			if (lobbyID !== null)
				removeUserFromLobby(userID, lobbyID);
			wsClientsMap.delete(userID);
		}
	});
}

export function wsSend(ws: WebSocket, message: string): void {
	if (ws && ws.readyState === ws.OPEN) {
		ws.send(message);
	} else {
		const payload = JSON.parse(message);
		console.log(`Error: Connection for userID < ${payload.userID} > not found or not open...`);
	}
}

async function informHostToStart(serv: FastifyInstance, req: FastifyRequest, socket: WebSocket, lobbyID: string) {
	const signal: string = await waitForSignal(serv, socket);
	if (signal !== 'in lobby') return;
	const lobby: lobbyInfo = lobbyMap.get(lobbyID)!;
	if (lobby.nbPlayers === lobby.userList.size) {
		const hostSocket: WebSocket = lobby.userList.get(lobby.hostID!)?.userSocket!;
		wsSend(hostSocket, JSON.stringify("start"));
	}
}

export function waitForSignal(serv: FastifyInstance, socket: WebSocket): Promise<string> {
	return new Promise((resolve, reject) => {
		socket.once('message', (message: string) => {
			try {
				const data = JSON.parse(message);
				if (!validateData(data, serv, socket)) return;
				
				const { payload } = data;
				if (!validatePayload(data, payload, serv, socket)) reject("invalid input");
				resolve(payload.signal);
			} catch (err: any) {
				socket.close(1003, err.message);
				serv.log.error(err.message);
			}
		});
	});
}