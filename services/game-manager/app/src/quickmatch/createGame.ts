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
		remote: true, // TODO this value can change just before click on start game
		userList: usersArray,
		score: "",
		winnerID: 0,
		loserID: 0
	};

	return game;
}

export function startGame(game: game) {
	natsPublish("game.request", JSON.stringify(game), "game.reply");
}

