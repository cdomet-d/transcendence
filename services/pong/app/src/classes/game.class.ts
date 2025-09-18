interface user {
	_username: string,
	_userID: number,
	_score: number; //TODO: needed?
}

export interface gameInfo {
	_gameID: number,
	_score: Array<number>,
	_local: boolean,
	_users: Array<user>,
	_winner: string,
	_loser: string
}

type socketMap = Map< number, WebSocket >;

export class Game {
    /*                             PROPERTIES                                */
	#_gameInfo: gameInfo;
	#_sockets: socketMap;

    /*                            CONSTRUCTORS                               */
	constructor(gameInfo: gameInfo) {
		this.#_gameInfo = gameInfo;
		this.#_sockets = new Map();
	}

    /*                              GETTERS                                  */
	get gameID(): number {
		return this.#_gameInfo._gameID;
	}

	get sockets(): socketMap {
		return this.#_sockets;
	}

    /*                              SETTERS                                  */
	set score(score: Array< number >) {
		this.#_gameInfo._score = score;
	}

	set winner(winner: string) {
		this.#_gameInfo._winner = winner;
	}

	set loser(loser: string) {
		this.#_gameInfo._loser = loser;
	}

    /*                              METHODS                                  */
	public addUserSocket(userID: number, socket: WebSocket) {
		this.#_sockets.set(userID, socket);
	}
}
