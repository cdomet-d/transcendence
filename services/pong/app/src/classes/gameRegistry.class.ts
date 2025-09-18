import type { Game } from "./game.class.js";

type gameMap = Map< number, Game >;

export class GameRegistry {
    /*                             PROPERTIES                                */
	#games_: gameMap;

    /*                            CONSTRUCTORS                               */
	constructor() {
		this.#games_ = new Map();
	}

    /*                              METHODS                                  */
	public addGame(newGame: Game) {
		this.#games_.set(newGame.gameID, newGame);
	}

	public deleteGame(gameID: number) {
		this.#games_.delete(gameID);
	}

	public findGame(gameID: number): Game | undefined {
		return this.#games_.get(gameID);
	}

    public fillGameStats() {

	}
}
