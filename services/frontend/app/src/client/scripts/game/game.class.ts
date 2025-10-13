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
	_ID: number,
	_keys: keysObj,
	_timeStamp: number,
}

export interface ballObj {
	x: number,
	y: number,
	dx: number,
	dy: number,
	lastdx: number
}

export interface serverReplyObj {
	ID: number;
	leftPaddle: coordinates;
	rightPaddle: coordinates;
	ball: coordinates;
}

type messMap = Array< [number, messObj] >;

export class Game {
	/*                             PROPERTIES                                */
	#_ctx: CanvasRenderingContext2D;
	#_local: boolean;
	#_leftPaddle: coordinates;
	#_rightPaddle: coordinates;
	#_paddleSpeed: number;
	#_ball: ballObj;
	#_mess: messObj;
	#_messHistory: messMap;
	#_servReply: serverReplyObj;
	#_frameId: number;
	#_delta: number;
	#_lastFrameTime: number;

	/*                            CONSTRUCTORS                               */
	constructor(ctx: CanvasRenderingContext2D, local: boolean) {
		this.#_ctx = ctx;
		this.#_local = local;
		this.#_ball = {x: WIDTH / 2, y: HEIGHT / 2, dx: 0.3, dy: 0.025, lastdx: 0.3};
		this.#_leftPaddle = {x: 10, y: 108}; //TODO: put operation
		this.#_rightPaddle = {x: 460, y: 108};
		this.#_paddleSpeed = 0.15;
		let keys: keysObj = {_w: false, _s: false, _ArrowUp: false, _ArrowDown: false};
		this.#_mess = { _ID: 0, _keys: keys, _timeStamp: 0 };
		this.#_messHistory = new Array();
		this.#_frameId = 0
		this.#_delta = 0;
		this.#_lastFrameTime = 0;
		this.#_servReply = { ID: 0, leftPaddle: {x: 10, y: 108}, rightPaddle: {x: 460, y: 108},ball: {x: WIDTH / 2, y: HEIGHT / 2}};
	}

	/*                              GETTERS                                  */
	get ball(): ballObj {
		return this.#_ball;
	}

	get leftPad(): coordinates {
		return this.#_leftPaddle;
	}

	get rightPad(): coordinates {
		return this.#_rightPaddle;
	}

	get paddleSpeed(): number {
		return this.#_paddleSpeed;
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

	get delta(): number {
		return this.#_delta;
	}

	get lastFrameTime(): number {
		return this.#_lastFrameTime;
	}

	get servReply(): serverReplyObj {
		return this.#_servReply;
	}

	get local(): boolean {
		return this.#_local;
	}

	get messHistory(): messMap {
		return this.#_messHistory;
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

	set delta(val: number) {
		this.#_delta = val;
	}

	set lastFrameTime(val: number) {
		this.#_lastFrameTime = val;
	}

    /*                              METHODS                                  */
	public addMess(mess: messObj) {
		this.#_messHistory.push([mess._ID, mess]);
	}

	public deleteMess(start: number, end: number) {
		while (start < end) {
			this.#_messHistory.splice(start, end - start);
			start++;
		}
	}
}
