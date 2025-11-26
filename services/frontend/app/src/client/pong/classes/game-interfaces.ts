/******************************** GAME OBJ ***********************************/
export interface keysObj {
    w: boolean;
    s: boolean;
    a: boolean;
    d: boolean;
    ArrowUp: boolean;
    ArrowDown: boolean;
    ArrowLeft: boolean;
    ArrowRight: boolean;
}

export interface ballObj {
    x: number;
    y: number;
    dx: number;
    dy: number;
    r: number;
}

export interface paddleSpec {
    speed: number;
    w: number;
    h: number;
    halfW: number;
    halfH: number;
}

export interface coordinates {
    x: number;
    y: number;
    [key: string]: number;
}

/**************************** WS DATA OBJ ********************************/
export interface paddleObj {
    coord: coordinates,
    step: coordinates
}

export interface repObj {
    _ID: number;
    _timestamp: number;
    _leftPad: paddleObj;
    _rightPad: paddleObj;
    _ball: ballObj;
    _score: [number, number];
    _end: boolean
}

export interface reqObj {
    _ID: number;
    _keys: keysObj;
    _timeStamp: number;
}
