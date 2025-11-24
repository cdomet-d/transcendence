import type { game, lobbyInfo, userInfo } from "../manager.interface.js";

export function createGameObj(lobbyInfo: lobbyInfo) {
	if (!lobbyInfo) {
		console.log("Error: lobbyInfo is empty!");
		return undefined;
	}

    const usersArray: userInfo[] = Array.from(lobbyInfo.userList.values());

	const game: game = {
		lobbyID: lobbyInfo.lobbyID!,
		gameID: crypto.randomUUID().toString(), // TODO get gameID from DB?
		remote: true,
		userList: usersArray,
		score: "",
		winnerID: 0,
		loserID: 0
	};

	return game;
}