interface userInfo {
	userID?: number,
	username?: string,
	userSocket?: WebSocket
}

interface lobbyInfo {
	lobbyId: number,
	whitelist: whitelist,
	userList: userInfo[],
    remote: boolean,
    format: "quick" | "tournament",
    // gameSettings?: string
}

interface whitelist {
	lobbyId: number,
	hostID: number,
	userIDs: number[]
}

export let lobbyMap: Map<number, lobbyInfo> = new Map();

// Lobby management
/*
LobbyMap
	stored in server memory,
	as long as there are still users inside
	(if host leaves, next user in list becomes host)

	contains LobbyID and LobbyInfoObj
*/


// CREATE LOBBY
/* On click >> create Lobby

BACK:
compose lobby Obj
add host to whitelist


FRONT:
show Lobby Room
	LobbyID
	participants
	game settings
	Start button greyed out while Lobby != full

*/


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