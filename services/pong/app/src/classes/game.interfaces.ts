/******************************** NATS DATA OBJ ***********************************/
export interface user {
    userID: number,
    username: string,
}

export interface gameInfo {
    lobbyID: number,
    gameID: number,
    tournamentID?: number,
    remote: boolean,
    users: [user, user],
    score: [number, number],
    winnerID: number,
    loserID: number,
    duration: number,
    longuestPass: number
}

/******************************** GAME OBJ ***********************************/
export interface keysObj {
	w: boolean,
	s: boolean,
    a: boolean,
    d: boolean,
	ArrowUp: boolean,
	ArrowDown: boolean,
    ArrowLeft: boolean,
    ArrowRight: boolean,
	[key: string]: boolean,
}

export interface ballObj {
    x: number,
    y: number,
    dx: number,
    dy: number,
    r: number
}

export interface paddleSpec {
    speed: number
    w: number,
    h: number,
    halfW: number,
    halfH: number
}

export interface coordinates {
    x: number;
    y: number;
}

export interface playerReq {
    _id: number,
    _req: reqObj,
} //TODO: find better way to register a req


/**************************** WS DATA OBJ ********************************/
export interface idsObj {
	gameID: number,
	userID: number
}

export interface paddleObj {
    coord: coordinates,
    step: coordinates
}

export interface repObj {
    _ID: number,
    _timestamp: number, // only used client side
    _leftPad: paddleObj,
    _rightPad: paddleObj,
    _ball: ballObj,
    _score: [number, number],
    _end: boolean
}

export interface reqObj {
    _ID: number,
    _keys: keysObj,
    _timeStamp: number,
}
