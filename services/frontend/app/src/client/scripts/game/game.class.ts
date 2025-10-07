export const HEIGHT = 270;
export const WIDTH = 480;
import type { coordinates } from "./mess.validation.js";

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

export class Game {
	/*                             PROPERTIES                                */
	#_ctx: CanvasRenderingContext2D;
	#_leftPaddle: coordinates;
	#_rightPaddle: coordinates;
	#_ball: coordinates;
	#_mess: messObj;
	#_frameId: number;

	/*                            CONSTRUCTORS                               */
	constructor(ctx: CanvasRenderingContext2D) {
		this.#_ctx = ctx;
		this.#_ball = {x: WIDTH / 2, y: HEIGHT / 2};
		this.#_leftPaddle = {x: 10, y: 108}; //TODO: put operation
		this.#_rightPaddle = {x: 460, y: 108};
		let keys: keysObj = {_w: false, _s: false, _ArrowUp: false, _ArrowDown: false};
		this.#_mess = { _keys: keys, _timeStamp: 0 };
		this.#_frameId = 0
	}

	/*                              GETTERS                                  */
	get ball(): coordinates {
		return this.#_ball;
	}

	get leftPad(): coordinates {
		return this.#_leftPaddle;
	}

	get rightPad(): coordinates {
		return this.#_rightPaddle;
	}

	get mess(): messObj {
		return this.#_mess;
	}

	get ctx(): CanvasRenderingContext2D {
		return this.#_ctx;
	}

	get frameId(): number {
		return this.#_frameId;
	}

	/*                              SETTERS                                  */
	set leftPad(newPos: number) {
		this.#_leftPaddle.y = newPos;
	}

	set rightPad(newPos: number) {
		this.#_rightPaddle.y = newPos;
	}

	set ball(ball: coordinates) {
		this.#_ball.x = ball.x;
		this.#_ball.y = ball.y;
	}

	set frameId(id: number) {
		this.#_frameId = id;
	}
}
