import type { Game } from "./game-class.js";

type gameMap = Map<string, Game>;

export class GameRegistry {
	/*                             PROPERTIES                                */
	#games: gameMap;

	/*                            CONSTRUCTORS                               */
	constructor() {
		this.#games = new Map();
	}

	/*                              METHODS                                  */
	public addGame(newGame: Game) {
		this.#games.set(newGame.gameID, newGame);
	}

	public deleteGame(gameID: string) {
		this.#games.delete(gameID);
	}

	public findGame(gameID: string): Game | undefined {
		return this.#games.get(gameID);
	}
}
