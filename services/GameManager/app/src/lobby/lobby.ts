
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

// Lobby management
/*
LobbyMap
	stored in server memory,
	as long as there are still users inside
	(if host leaves, next user in list becomes host)

	Map<number: LobbyID, lobbyInfo: lobbyInfo>
*/


/*
FRONT:
show Lobby Room
	LobbyID
	participants
	game settings
	Start button greyed out while Lobby != full (HOST ONLY CAN START GAME?)

*/

// upon ws connection to GM
export function createLobby(hostID: number) {

	const lobbyObj: lobbyInfo = makeLobbyInfo(hostID);
	lobbyMap.set(lobbyObj.lobbyID, lobbyObj);

	// we have lobby :)
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
			{userID: hostID} // and add them there when they join
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