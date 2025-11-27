import type { Game } from "./game-class.js";

type gameMap = Map<number, Game>;

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

	public deleteGame(gameID: number) {
		this.#games.delete(gameID);
	}

	public findGame(gameID: number): Game | undefined {
		return this.#games.get(gameID);
	}
}
