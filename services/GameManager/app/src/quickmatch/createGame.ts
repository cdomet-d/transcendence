import type * as GM from "../manager.js";
import type { lobbyInfo } from "../lobby/lobby.js";

export function createGameObj(lobbyInfo: lobbyInfo) {
	if (!lobbyInfo) {
		console.log("Error: lobbyInfo is empty!");
		return false;
	}

	const game: GM.game = {
		lobbyID: lobbyInfo.lobbyID!,
		gameID: 99,
		remote: true,
		userList: lobbyInfo.userList,
		score: "",
		winnerID: 0,
		loserID: 0
	};

	return game;
}