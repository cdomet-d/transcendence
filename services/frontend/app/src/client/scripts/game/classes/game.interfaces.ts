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
    x: number,
	y: number,
	[key: string]: number,
}

/**************************** WS DATA OBJ ********************************/
export interface repObj {
    _ID: number,
	_timestamp: number,
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
