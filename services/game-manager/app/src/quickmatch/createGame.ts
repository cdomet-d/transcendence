import type { game, lobbyInfo, userInfo } from "../manager.interface.js";

export function createGameObj(lobbyInfo: lobbyInfo) {
	if (!lobbyInfo) {
		console.log("Error: lobbyInfo is empty!");
		return undefined;
	}

    const usersArray: userInfo[] = Array.from(lobbyInfo.userList.values());

	const game: game = {
		lobbyID: lobbyInfo.lobbyID!,
		gameID: 99,
		remote: true,
		userList: usersArray,
		score: "",
		winnerID: 0,
		loserID: 0
	};

	return game;
}