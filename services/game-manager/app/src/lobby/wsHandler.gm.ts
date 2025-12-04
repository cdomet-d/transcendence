import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { processGameRequest } from '../gameManager/gameManager.js';
import { wsClientsMap, addUserToLobby, createLobby, lobbyMap, removeUserFromLobby, addUserToWhitelist, removeUserFromWhitelist } from './lobby.gm.js';
import { validateData, validatePayload } from '../gameManager/inputValidation.js';
import type { lobbyInfo } from '../gameManager/gameManager.interface.js';
import type { lobbyRequestForm, gameNotif } from './lobby.interface.js';
import { natsPublish } from '../nats/publisher.gm.js';

export function wsHandler(this: FastifyInstance, socket: WebSocket, req: FastifyRequest): void {
	let userID: string | null = null;

	socket.on('message', (message: string) => {
		try {
			// TODO make custom GAME_INVITE interface to schema check with ajv
			const data = JSON.parse(message);
			// if (!validateData(data, req, socket)) return;

			const { payload, formInstance } = data;
			// if (!validatePayload(data, payload, req, socket)) return;

			if (data.event === "BAD_USER_TOKEN") return;

			if (data.event === "LOBBY_REQUEST") {
				const lobbyPayload = payload as lobbyRequestForm;

				userID = lobbyPayload.userID;
				console.log("lobbyHost UID: ", userID);

				if (!wsClientsMap.has(userID!) && lobbyPayload.action !== "invite") {
					wsClientsMap.set(userID!, socket);
				}

				if (lobbyPayload.action === "create") {
					this.log.error("IN CREATE");
					const newLobby: lobbyInfo = createLobby(userID!, lobbyPayload.format);
					wsSend(socket, JSON.stringify({ lobby: "created", lobbyID: newLobby.lobbyID, formInstance: formInstance }))
				} else if (lobbyPayload.action === "invite") {
					this.log.error("INVITE RECEIVED");
					const inviteeID = lobbyPayload.inviteeID!;
					//
					// TODO This a function (findLobbyIDfromUID())
					let lobbyID: string | undefined = undefined;

					for (const [_, lobbyInfo] of lobbyMap.entries()) {
						if (lobbyInfo.userList.has(userID)) {
							lobbyID = lobbyInfo.lobbyID;
							break;
						}
					}
					//
					const notif: gameNotif = {
						type: 'GAME_INVITE',
						senderID: userID,
						receiverID: inviteeID,
						lobbyID: lobbyID!,
						// gameType: ;
					};
					addUserToWhitelist(inviteeID, lobbyID!);
					natsPublish(this, "post.notif", JSON.stringify(notif));
				} else if (lobbyPayload.action === "decline") {
					this.log.error("IN DECLINE");
					const inviteeID = lobbyPayload.inviteeID!;
					removeUserFromWhitelist(inviteeID, lobbyPayload.lobbyID!);
				} else if (lobbyPayload.action === "join") {
					this.log.error("IN JOIN");
					addUserToLobby(userID!, socket, lobbyPayload.lobbyID!);
					wsSend(socket, JSON.stringify({ lobby: "joined", lobbyID: lobbyPayload.lobbyID }));
				}
			} else if (data.event === "GAME_REQUEST") {
				const gamePayload = payload as lobbyInfo;
				processGameRequest(this, gamePayload);
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