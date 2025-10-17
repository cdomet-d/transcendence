export const HEIGHT = 270;
export const WIDTH = 480;
import type { coordinates, repObj } from "./mess.validation.js";

export interface keysObj {
	_w: boolean,
	_s: boolean,
	_ArrowUp: boolean,
	_ArrowDown: boolean,
}

export interface reqObj {
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

type requestMap = Map< number, reqObj >;
type replyTab = Array< repObj >;

export class Game {
	/*                             PROPERTIES                                */
	#_ctx: CanvasRenderingContext2D;
	#_local: boolean;
	#_leftPaddle: coordinates;
	#_rightPaddle: coordinates;
	#_paddleSpeed: number;
	#_ball: ballObj;
	#_req: reqObj;
	#_reqHistory: requestMap;
	#_frameId: number;
	#_delta: number;
	#_lastFrameTime: number;
	#_lastUpdateTime: number;
	#_predictedBall: coordinates;
	#_replyHistory: replyTab;

	/*                            CONSTRUCTORS                               */
	constructor(ctx: CanvasRenderingContext2D, local: boolean) {
		this.#_ctx = ctx;
		this.#_local = local;
		this.#_ball = {x: WIDTH / 2, y: HEIGHT / 2, dx: 0.3, dy: 0.025, lastdx: 0.3};
		this.#_leftPaddle = {x: 10, y: 108}; //TODO: put operation
		this.#_rightPaddle = {x: 460, y: 108};
		this.#_paddleSpeed = 0.15;
		let keys: keysObj = {_w: false, _s: false, _ArrowUp: false, _ArrowDown: false};
		this.#_req = { _ID: 0, _keys: keys, _timeStamp: 0 };
		this.#_reqHistory = new Map();
		this.#_frameId = 0
		this.#_delta = 0;
		this.#_lastFrameTime = 0;
		this.#_lastUpdateTime = 0;
		this.#_predictedBall = {x: 0, y: 0};
		this.#_replyHistory = new Array();
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

	get req(): reqObj {
		return this.#_req;
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

	get local(): boolean {
		return this.#_local;
	}

	get reqHistory(): requestMap {
		return this.#_reqHistory;
	}

	get lastUpdateTime(): number {
		return this.#_lastUpdateTime;
	}

	get predictedBall(): coordinates {
		return this.#_predictedBall;
	}

	get replyHistory(): replyTab {
		return this.#_replyHistory;
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

	set lastUpdateTime(time: number) {
		this.#_lastUpdateTime = time;
	}

    /*                              METHODS                                  */
	public addReq(req: reqObj) {
		const newReq: reqObj = { _ID: req._ID, _keys: { ...req._keys }, _timeStamp: req._timeStamp };
		this.#_reqHistory.set(req._ID, newReq);
	}

	public deleteReq(id: number) {
		for (const key of this.#_reqHistory.keys()) {
			if (key <= id) {
				this.#_reqHistory.delete(key);
			}
		}
	}

	public addReply(reply: repObj) {
		const newReply: repObj = { _ID: reply._ID, _timestamp: reply._timestamp, _leftPad: { ...reply._leftPad}, _rightPad: { ...reply._rightPad}, _ball: { ...reply._ball} };
		this.#_replyHistory.push(newReply);
	}

	public deleteReplies(length: number) {
		this.#_replyHistory.splice(0, length);
	}

	public getReply(renderTime: number): [repObj, repObj] | null {
		for (let i = 0; i < this.#_replyHistory.length - 1; i++) {
			if (this.#_replyHistory[i]!._timestamp <= renderTime
				&& this.#_replyHistory[i + 1]!._timestamp >= renderTime)
				return [this.#_replyHistory[i]!, this.#_replyHistory[i + 1]!];
		} //TODO: fix !
		return null;
	}
}
