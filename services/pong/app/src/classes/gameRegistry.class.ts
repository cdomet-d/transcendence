import type { Game } from "./game.class.js";

type gameMap = Map< number, Game >;

export class GameRegistry {
    /*                             PROPERTIES                                */
	#_games: gameMap;

    /*                            CONSTRUCTORS                               */
	constructor() {
		this.#_games = new Map();
	}

    /*                              METHODS                                  */
	public addGame(newGame: Game) {
		this.#_games.set(newGame.gameID, newGame);
	}

	public deleteGame(gameID: number) {
		this.#_games.delete(gameID);
	}

	public findGame(gameID: number): Game | undefined {
		return this.#_games.get(gameID);
	}
}
