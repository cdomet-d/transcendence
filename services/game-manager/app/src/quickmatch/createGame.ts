import type { game, lobbyInfo, userInfo } from "../manager.interface.js";
import { natsPublish } from "../nats/publisher.js";

export function createGameObj(lobbyInfo: lobbyInfo) {
	if (!lobbyInfo) {
		console.log("Error: lobbyInfo is empty!");
		return undefined;
	}

    const usersArray: userInfo[] = Array.from(lobbyInfo.userList.values());

	const game: game = {
		lobbyID: lobbyInfo.lobbyID!,
		tournamentID: "-1",
		gameID: crypto.randomUUID().toString(),
		remote: lobbyInfo.remote, // TODO this value will change just before click on start local game 
		users: usersArray,
		score: [0, 0],
		winnerID: 0,
		loserID: 0, 
		duration: 0, 
		longuestPass: 0,
		startTime: "",
		// gameSettings
	};

	// console.log("USER ARRAY: ", game.users)
	return game;
}

export function startGame(game: game) {
        console.log("6");

	natsPublish("game.request", JSON.stringify(game), "game.reply");
}