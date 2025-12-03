import type { userInfo, lobbyInfo } from "../manager.interface.js";
export const wsClientsMap: Map<string, WebSocket> = new Map();
export const lobbyMap: Map<string | undefined, lobbyInfo> = new Map();

export function createLobby(hostID: string, format: string) {
	const lobby: lobbyInfo = makeLobbyInfo(hostID, format);
	lobbyMap.set(lobby.lobbyID, lobby);
	return lobby;
}

// add INVITEE in parameter and get all userInfo (invitee) from JWT payload
function makeLobbyInfo(hostID: string, format: string): lobbyInfo {
	const lobbyID = crypto.randomUUID().toString();

	const lobby: lobbyInfo = {
		lobbyID: lobbyID,
		whitelist: {
			lobbyId: lobbyID,
			hostID: hostID,
			userIDs: new Map<string, userInfo>([
				[hostID, { userID: hostID }], // TODO Make this a map // 1. put invitee ID here on invite
			]),
		},
		joinable: true,
        userList: new Map<string, userInfo>([
            [hostID, { userID: hostID }] //  TODO get username JWT
        ]),
		remote: true, // TODO set remote or local HERE just before START event
		format: format,
		nbPlayers: format === "quickmatch" ? 2 : 4
	}

	return lobby;
}

export function addUserToLobby(userID: string, socket: WebSocket, lobbyID: string) {
	const lobby = lobbyMap.get(lobbyID);
	if (!lobby) return;

	if (!lobby.userList.has(userID)) {
		lobby.userList.set(userID, { userID }); // add username (and socket?) too
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

// export function printPlayersInLobby(lobbyID: string) {
// 	const lobby = lobbyMap.get(lobbyID);
// 	if (!lobby) {
// 		console.log(`Lobby #${lobbyID} not found`);
// 		return;
// 	}
// 	lobby?.userList.forEach(user => {
// 		console.log(`User #${user.userID} is in Lobby #${lobbyID}`);
// 	});
// }
