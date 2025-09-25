export interface keysObj {
    _w: boolean,
    _s: boolean,
    _ArrowUp: boolean,
    _ArrowDown: boolean,
}

export interface messObj {
    _keys: keysObj,
    _timeStamp: number,
}

export interface paddle {
	x: number;
	y: number;
}

export class Game {
    /*                             PROPERTIES                                */
    #_ctx: CanvasRenderingContext2D;
    #_height: number;
    #_width: number;
    #_leftPaddle: paddle;
    #_rightPaddle: paddle;
    #_mess: messObj;

    /*                            CONSTRUCTORS                               */
    constructor(ctx: CanvasRenderingContext2D) {
        this.#_ctx = ctx;
        this.#_height = 270;
        this.#_width = 480;
        this.#_leftPaddle = {x: 10, y: 108}; //TODO: put operation
        this.#_rightPaddle = {x: 460, y: 108};
        let keys: keysObj = {_w: false, _s: false, _ArrowUp: false, _ArrowDown: false};
        this.#_mess = { _keys: keys, _timeStamp: 0 };
    }

    /*                              GETTERS                                  */
    get leftPad(): paddle {
        return this.#_leftPaddle;
    }

    get rightPad(): paddle {
        return this.#_rightPaddle;
    }

    get mess(): messObj {
        return this.#_mess;
    }

    get height(): number {
        return this.#_height;
    }

    get width(): number {
        return this.#_width;
    }

    get ctx() : CanvasRenderingContext2D {
        return this.#_ctx;
    }

    /*                              SETTERS                                  */
    set leftPad(newPos: number) {
        this.#_leftPaddle.y = newPos;
    }

    set rightPad(newPos: number) {
        this.#_rightPaddle.y = newPos;
    }
}
