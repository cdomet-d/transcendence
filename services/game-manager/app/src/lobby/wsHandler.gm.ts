import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { lobbyMap, removeUserFromLobby, findLobbyIDFromUserID } from './lobby.gm.js';
import { validateData, validatePayload } from '../gameManager/inputValidation.gm.js';
import type { lobbyInfo } from '../gameManager/gameManager.interface.js';
import type { lobbyRequestForm, lobbyInviteForm, lobbyJoinForm, lobbyDeclineForm } from './lobby.interface.js';
import { stopHandler } from '../tournament/tournamentStart.js';
import { handleGameRequest, handleLobbyRequest } from './wsRequests.gm.js';
import { authenticateConnection } from './wsUtils.gm.js';
import { handleDeclineAction, handleInviteAction, handleJoinAction } from './wsInvites.gm.js';

const wsClientsMap: Map<string, WebSocket> = new Map();
const RATE_LIMIT_WINDOW = 1000;
const MAX_MESSAGES_PER_WINDOW = 10;
const MAX_MESSAGE_SIZE = 10 * 1024;

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function wsHandler(this: FastifyInstance, socket: WebSocket, req: FastifyRequest) {
	const authResult = authenticateConnection(this, req, socket);
	if (!authResult) return;
	const { userID: authenticatedUserID, username: authenticatedUsername } = authResult;
	if (wsClientsMap.has(authenticatedUserID))
		socket.close(4003, "Already in a lobby!");
	wsClientsMap.set(authenticatedUserID, socket);
    rateLimitMap.set(authenticatedUserID, { count: 0, resetTime: Date.now() + RATE_LIMIT_WINDOW });

    socket.on('message', (message: Buffer | string) => {
        try {
            const messageSize = Buffer.byteLength(message);
            if (messageSize > MAX_MESSAGE_SIZE) {
                req.server.log.warn(`Message too large from user ${authenticatedUserID}: ${messageSize} bytes`);
                wsSend(socket, JSON.stringify({ 
                    error: 'Message size exceeds limit',
                    maxSize: MAX_MESSAGE_SIZE 
                }));
                socket.close(1008, 'Message size exceeded');
                return;
            }

            const now = Date.now();
            const rateLimit = rateLimitMap.get(authenticatedUserID);
            
            if (rateLimit) {
                if (now > rateLimit.resetTime) {
                    rateLimit.count = 1;
                    rateLimit.resetTime = now + RATE_LIMIT_WINDOW;
                } else {
                    rateLimit.count++;
                    
                    if (rateLimit.count > MAX_MESSAGES_PER_WINDOW) {
                        req.server.log.warn(`Rate limit exceeded for user ${authenticatedUserID}`);
                        wsSend(socket, JSON.stringify({ 
                            error: 'Rate limit exceeded',
                            retryAfter: Math.ceil((rateLimit.resetTime - now) / 1000)
                        }));
                        return;
                    }
                }
            }

            const data = JSON.parse(message.toString());
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
					handleInviteAction(this, payload as lobbyInviteForm, authenticatedUserID, socket, req);
					break;
				case 'LOBBY_JOIN':
					handleJoinAction(payload as lobbyJoinForm, authenticatedUserID, authenticatedUsername, socket, req, this);
            		break;
				case 'LOBBY_DECLINE':
					handleDeclineAction(this, payload as lobbyDeclineForm, authenticatedUserID, socket, req);
            		break;
			}
		} catch (error) {
			socket.close(1003, `Malformed WS message`);
			req.server.log.error(`Malformed WS message: ${error}`);
		}
	});

	socket.onclose = (ev: any) => {
		if (authenticatedUserID !== null) {
			let lobbyID: string | undefined = findLobbyIDFromUserID(authenticatedUserID, socket);
			if (lobbyID !== undefined)
				removeUserFromLobby(authenticatedUserID, lobbyID, ev.code, this);
			wsClientsMap.delete(authenticatedUserID);
		}
	};
}

export function wsSend(ws: WebSocket, message: string): void {
	if (ws && ws.readyState === ws.OPEN) {
		ws.send(message);
	} else {
		const payload = JSON.parse(message);
		// console.log(`Error: Connection for userID < ${payload.userID} > not found or not open...`);
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
