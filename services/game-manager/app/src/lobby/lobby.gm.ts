import type { userInfo, lobbyInfo } from "../gameManager/gameManager.interface.js";
export const wsClientsMap: Map<number, WebSocket> = new Map();
export const lobbyMap: Map<string | undefined, lobbyInfo> = new Map();

export function createLobby(hostID: number, format: string) {
	const lobby: lobbyInfo = makeLobbyInfo(hostID, format);
	lobbyMap.set(lobby.lobbyID, lobby);
	return lobby;
}

// add INVITEE in parameter and get all userInfo (invitee) from JWT payload
function makeLobbyInfo(hostID: number, format: string): lobbyInfo {
	const lobbyID = crypto.randomUUID().toString();

	const lobby: lobbyInfo = {
		lobbyID: lobbyID,
		whitelist: {
			lobbyId: lobbyID,
			hostID: hostID,
			userIDs: new Map<number, userInfo>([
				[hostID, { userID: hostID }], // TODO Make this a vector ? // 1. put invitee ID here on invite
			]),
		},
		joinable: true,
		userList: new Map<number, userInfo>([
			[hostID, { userID: hostID }],
		]),
		remote: true, // TODO set to false if local pong before START event
		format: format,
		nbPlayers: format === "quickmatch" ? 2 : 4
	}

	return lobby;
}

export function addUserToWhitelist(userID: number, lobbyID: string) {
	const lobby = lobbyMap.get(lobbyID);
	if (!lobby) return;

	if (lobby.whitelist?.userIDs.size === 4) return; // send `whitelist full` to front?

	if (lobby.whitelist?.userIDs.has(userID)) {
		lobby.whitelist?.userIDs.set(userID, { userID });
	}
}

export function removeUserFromWhitelist(userID: number, lobbyID: string) {
	const lobby = lobbyMap.get(lobbyID);
	if (!lobby) return;

	lobby.whitelist!.userIDs.delete(userID);
}

export function addUserToLobby(userID: number, socket: WebSocket, lobbyID: string) {
	const lobby = lobbyMap.get(lobbyID);
	if (!lobby) return;

	if (!lobby.userList.has(userID)) {
		lobby.userList.set(userID, { userID });
	}

	if (!wsClientsMap.has(userID)) {
		wsClientsMap.set(userID, socket);
	}
}

export function removeUserFromLobby(userID: number, lobbyID: string) {
	const lobby = lobbyMap.get(lobbyID);
	if (!lobby) return;

	lobby.userList.delete(userID);
	lobby.whitelist!.userIDs.delete(userID);
	wsClientsMap.delete(userID);
}