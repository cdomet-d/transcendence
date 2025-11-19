/******************************** NATS DATA OBJ ***********************************/
export interface user {
    userID: number,
    username: string,
}

export interface gameInfo {
    gameID: number,
    tournamentID: number,
    remote: boolean,
    users: [user, user],
    score: [number, number],
    winnerID: number,
    loserID: number,
    duration: number
}

/******************************** GAME OBJ ***********************************/
export interface keysObj {
	_w: boolean,
	_s: boolean,
    _a: boolean,
    _d: boolean,
	_ArrowUp: boolean,
	_ArrowDown: boolean,
    _ArrowLeft: boolean,
    _ArrowRight: boolean,
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

export interface repObj {
    _ID: number,
    _timestamp: number, // only used client side
    _leftPad: coordinates,
    _rightPad: coordinates,
    _ball: ballObj,
    _score: [number, number]
}

export interface reqObj {
    _ID: number,
    _keys: keysObj,
    _timeStamp: number,
}
