
interface userInfo {
	userID?: number,
	username?: string,
	userSocket?: WebSocket
}

export interface lobbyInfo {
	lobbyID?: number,
	whitelist?: whitelist,
	joinable?: boolean,
	userList: userInfo[],
	remote: boolean,
	format: "quick" | "tournament" | string,
	nbPlayers: number
	// gameSettings?: string
}

interface whitelist {
	lobbyId: number,
	hostID: number,
	userIDs: number[]
}

export const lobbyMap: Map<number | undefined, lobbyInfo> = new Map();

export function createLobby(hostID: number, format: string) {
	const lobby: lobbyInfo = makeLobbyInfo(hostID, format);
	lobbyMap.set(lobby.lobbyID, lobby);
}

export function addUserToLobby(uid: number, lobbyID: number) {
	const lobby/* : lobbyInfo | undefined */ = lobbyMap.get(lobbyID);
	if (!lobby) {
		console.log("Error: lobbyID not found in GM lobbyMap!");
		return;
	}
	lobby?.userList.push({ userID: uid });
	console.log(`User #${uid} has been added to lobby`);
}

function makeLobbyInfo(hostID: number, format: string): lobbyInfo {
	const lobbyID: number = getUniqueLobbyID();

	const lobby: lobbyInfo = {
		lobbyID: lobbyID,
		whitelist: {
			lobbyId: lobbyID,
			hostID: hostID,
			userIDs: [hostID] // 1. put invitee ID here on invite
		},
		joinable: true,
		userList: [
			{ userID: hostID } // 2. add invitees there when they join
		],
		remote: true, // TODO: TBD
		format: format,
		nbPlayers: format === "quick" ? 2 : 4
	}

	return lobby;
}

// TODO: same as getUniqueUserID(), need DB for lobby IDs ?
let idIndex: number = 1;

function getUniqueLobbyID(): number {
	const uniqueID = idIndex++;
	return uniqueID;
}

export function printPlayersInLobby(lobbyID: number) {
	const lobby = lobbyMap.get(lobbyID);
	if (!lobby) {
		console.log("AAAH PAS DE LOBBY");
		return;
	}
	lobby?.userList.forEach(user => {
		console.log(`User #${user.userID} is in Lobby #${lobbyID}`);
	});
}
