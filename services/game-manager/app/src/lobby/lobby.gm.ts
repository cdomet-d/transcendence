import type { userInfo, lobbyInfo, whitelist } from '../gameManager/gameManager.interface.js';
import type { WebSocket } from '@fastify/websocket';
import { wsSend } from './wsHandler.gm.js';
export const wsClientsMap: Map<string, WebSocket> = new Map();
export const lobbyMap: Map<string | undefined, lobbyInfo> = new Map();

export function createLobby(host: userInfo, format: string) {
	const lobby: lobbyInfo = makeLobbyInfo(host, format);
	lobbyMap.set(lobby.lobbyID, lobby);
	return lobby;
}

function makeLobbyInfo(host: userInfo, format: string): lobbyInfo {
	const lobbyID = crypto.randomUUID().toString();

	const lobby: lobbyInfo = {
		hostID: host.userID!,
		lobbyID: lobbyID,
		whitelist: {
			lobbyId: lobbyID,
			hostID: host.userID!,
			userIDs: new Map<string, userInfo>([
				[host.userID!, { userID: host.userID!, username: host.username! }],
			]),
		},
		joinable: true,
		userList: new Map<string, userInfo>([
			[host.userID!, { userID: host.userID!, username: host.username!, userSocket: host.userSocket! }],
		]),
		remote: true,
		format: format,
		nbPlayers: format === 'quickmatch' ? 2 : 4,
		start: false,
	}
	return lobby;
}

export function addUserToWhitelist(user: userInfo, lobbyID: string) {
	const lobby = lobbyMap.get(lobbyID);
	if (!lobby) return;

	if (lobby.whitelist?.userIDs.size === 4) return;

	if (lobby.whitelist?.userIDs.has(user.userID!) === false) {
		lobby.whitelist?.userIDs.set(user.userID!, { userID: user.userID!, username: user.username! });
		sendUpdatedWhiteList(lobbyID);
	}
}

export function removeUserFromWhitelist(userID: string, lobbyID: string) {
	const lobby = lobbyMap.get(lobbyID);
	if (!lobby) return;
	lobby.whitelist!.userIDs.delete(userID);
	sendUpdatedWhiteList(lobbyID);
}

function sendUpdatedWhiteList(lobbyID: string) {
	const whiteListUsernames: string[] = getWhiteListUsernames(lobbyID);
	const lobbyUserList: Map<string, userInfo> = lobbyMap.get(lobbyID)?.userList!;
	for (const user of lobbyUserList) {
		wsSend(user[1].userSocket!, JSON.stringify({ lobby: 'whiteListUpdate', whiteListUsernames: whiteListUsernames}))
	}
}

export function getWhiteListUsernames(lobbyID: string): string[] {
	const whiteList: whitelist = lobbyMap.get(lobbyID)?.whitelist!;
	const whiteListUsernames: string[] = Array.from(whiteList.userIDs.values()).map(user => user.username!)
	return whiteListUsernames;
}

export function addUserToLobby(userID: string, username: string, socket: WebSocket, lobbyID: string) {
	const lobby = lobbyMap.get(lobbyID);
	if (!lobby) return;


	if (!lobby.whitelist?.userIDs.has(userID)) {
		wsSend(socket, JSON.stringify({ error: 'not invited' }));
		return;
	}

	if (!lobby.userList.has(userID)) {
		lobby.userList.set(userID, { userID: userID, username: username, userSocket: socket });
	}

	if (!wsClientsMap.has(userID)) {
		wsClientsMap.set(userID, socket);
	}
}

export function removeUserFromLobby(userID: string, lobbyID: string, code: number) {
	const lobby = lobbyMap.get(lobbyID);
	if (!lobby) return;
	if (userID === lobby.hostID! && lobby.start === false) {
		for (const user of lobby.userList) {
			if (user[1].userID! !== userID && user[1].userSocket !== undefined
				&& code !== 4002)
				user[1].userSocket!.close(4001, "Lobby was closed by host")
		}
		lobbyMap.delete(lobbyID);
		return;
	}
	lobby.userList.delete(userID);
	lobby.whitelist!.userIDs.delete(userID);
	sendUpdatedWhiteList(lobbyID);
}

export function findLobbyIDFromUserID(userID: string, socket: WebSocket): string | undefined {
	let lobbyID: string | undefined = undefined; 
	
	for (const [_, lobbyInfo] of lobbyMap.entries()) {
		if (lobbyInfo.userList.has(userID!) && lobbyInfo.userList.get(userID)?.userSocket === socket) {
			lobbyID = lobbyInfo.lobbyID!;
			break;
		}
	}
	return lobbyID;
}