
interface userInfo {
	userID?: number,
	username?: string,
	userSocket?: WebSocket
}

interface lobbyInfo {
	lobbyID: number,
	whitelist: whitelist,
	available: boolean,
	userList: userInfo[],
	remote: boolean,
	format: "quick" | "tournament",
	players: number
	// gameSettings?: string
}

interface whitelist {
	lobbyId: number,
	hostID: number,
	userIDs: number[]
}

export const lobbyMap: Map<number, lobbyInfo> = new Map();

/*
FRONT:
show Lobby Room
	LobbyID
	participants
	game settings
	Start button greyed out while Lobby != full (HOST ONLY CAN START GAME?)

*/

export function createLobby(hostID: number) {
	const lobby: lobbyInfo = makeLobbyInfo(hostID);
	lobbyMap.set(lobby.lobbyID, lobby);
}

export function addUserToLobby(uid: number, lobbyID: number) {
	const lobby/* : lobbyInfo | undefined */ = lobbyMap.get(lobbyID);
	if (!lobby) {
		console.log("Error: lobbyID not found in GM lobbyMap!");
	}
	lobby?.userList.push({ userID: uid });
	console.log(`User #${uid} has been added to lobby`);
}


function makeLobbyInfo(hostID: number): lobbyInfo {

	const lobbyID: number = getUniqueLobbyID();

	const lobby: lobbyInfo = {
		lobbyID: lobbyID,
		whitelist: {
			lobbyId: lobbyID,
			hostID: hostID,
			userIDs: [hostID] // put invitees here
		},
		available: true,
		userList: [
			{ userID: hostID } // and add them there when they join
		],
		remote: true,
		format: "tournament",
		players: 4
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
	const lobby = lobbyMap.get(1);
	if (!lobby) {
		console.log("AAAH PAS DE LOBBY");
	}
	lobby?.userList.forEach(user => {
		console.log(`User #${user.userID} is in Lobby #1`);
	});
}


// JOIN LOBBY
/*
On connect >>> check if userID is in whitelist

if not
	Error message
else
	add user to userList
	show them in lobby room
	signal all others that new user has joined
*/