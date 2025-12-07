import type { userInfo, lobbyInfo } from '../gameManager/gameManager.interface.js';
import type { WebSocket } from '@fastify/websocket';
export const wsClientsMap: Map<string, WebSocket> = new Map();
export const lobbyMap: Map<string | undefined, lobbyInfo> = new Map();

export function createLobby(host: userInfo, format: string) {
	const lobby: lobbyInfo = makeLobbyInfo(host, format);
	lobbyMap.set(lobby.lobbyID, lobby);
	return lobby;
}

// add INVITEE in parameter and get all userInfo (invitee) from JWT payload
function makeLobbyInfo(host: userInfo, format: string): lobbyInfo {
	const lobbyID = crypto.randomUUID().toString();

	const lobby: lobbyInfo = {
		lobbyID: lobbyID,
		whitelist: {
			lobbyId: lobbyID,
			hostID: host.userID!,
			userIDs: new Map<string, userInfo>([
				[host.userID!, { userID: host.userID!, username: host.username! }], // TODO Make this a vector ? // 1. put invitee ID here on invite
			]),
		},
		joinable: true,
		userList: new Map<string, userInfo>([
			[host.userID!, { userID: host.userID!, username: host.username! }],//TODO: need username ?
		]),
		remote: true, // TODO set to false if local pong before START event
		format: format,
		nbPlayers: format === 'quickmatch' ? 2 : 4
	}
	return lobby;
}

export function addUserToWhitelist(user: userInfo, lobbyID: string) {
	const lobby = lobbyMap.get(lobbyID);
	if (!lobby) return;

	if (lobby.whitelist?.userIDs.size === 4) return; // send `whitelist full` to front?

	if (lobby.whitelist?.userIDs.has(user.userID!) === false) {
		lobby.whitelist?.userIDs.set(user.userID!, { userID: user.userID!, username: user.username! });
	}
}

export function removeUserFromWhitelist(userID: string, lobbyID: string) {
	const lobby = lobbyMap.get(lobbyID);
	if (!lobby) return;

	lobby.whitelist!.userIDs.delete(userID);
}

export function addUserToLobby(userID: string, socket: WebSocket, lobbyID: string) {
	const lobby = lobbyMap.get(lobbyID);
	if (!lobby) return;

	if (!lobby.userList.has(userID)) {
		lobby.userList.set(userID, { userID: userID });
	}

	if (!wsClientsMap.has(userID)) {
		wsClientsMap.set(userID, socket);
	}
}

export function removeUserFromLobby(userID: string, lobbyID: string) {
	const lobby = lobbyMap.get(lobbyID);
	if (!lobby) return;

	lobby.userList.delete(userID);
	lobby.whitelist!.userIDs.delete(userID);
	wsClientsMap.delete(userID);
}

export function printPlayersInLobby(lobbyID: string) {
	const lobby = lobbyMap.get(lobbyID);
	if (!lobby) {
		console.log('AAAH PAS DE LOBBY');
		return;
	}
	lobby?.userList.forEach(user => {
		console.log(`User #${user.userID} is in Lobby #${lobbyID}`);
	});
}

export function findLobbyIDFromUserID(userID: string): string | null {
	let lobbyID: string | null = null; 
	
	for (const [_, lobbyInfo] of lobbyMap.entries()) {
		if (lobbyInfo.userList.has(userID!)) {
			lobbyID = lobbyInfo.lobbyID!;
			break;
		}
	}
	return lobbyID;
}