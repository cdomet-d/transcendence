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
    [key: string]: boolean;
}

export interface ballObj {
    x: number;
    y: number;
    dx: number;
    dy: number;
    maxSpeed: number;
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
    coord: coordinates;
    step: coordinates;
}

export interface repObj {
    ID: number;
    timestamp: number;
    leftPad: paddleObj;
    rightPad: paddleObj;
    ball: ballObj;
    score: [number, number];
    end: boolean;
}

export interface reqObj {
    ID: number;
    keys: keysObj;
    timeStamp: number;
}
