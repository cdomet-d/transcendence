export const HEIGHT = 558.9;
export const WIDTH = 1000;
import type { PongUI } from '../../web-elements/game/game-ui.js';
import type { reqObj, ballObj, paddleSpec, coordinates, repObj, paddleObj } from './game-interfaces.js';

type requestMap = Map<number, reqObj>;
type replyTab = Array<repObj>;

export class Game {
    /*                             PROPERTIES                                */
    #_ball: ballObj;
    #_ctx: CanvasRenderingContext2D;
    #_ui: PongUI;
    #_delta: number;
    #_frameId: number;
    #_horizontal: boolean;
    #_lastFrameTime: number;
    #_leftPaddle: coordinates;
	#_leftStep: coordinates;
    #_local: boolean;
    #_paddleSpec: paddleSpec;
    #_replyHistory: replyTab;
    #_req: reqObj;
    #_reqHistory: requestMap;
    #_rightPaddle: coordinates;
	#_rightStep: coordinates;
    #_score: [number, number];

	/*                            CONSTRUCTORS                               */
	constructor(ctx: CanvasRenderingContext2D, remote: boolean, horizontal: boolean, ui: PongUI) {
		this.#_ctx = ctx;
		this.#_ui = ui;
		if (remote) this.#_local = false;
		else this.#_local = true;
		this.#_horizontal = horizontal;
		this.#_score = [0, 0];
		this.#_ball = {
			x: WIDTH / 2,
			y: HEIGHT / 2,
			dx: 0.3, //custom
			dy: 0.03, //custom
			maxSpeed: 0.70,
			r: 13,
		};
		this.#_paddleSpec = { speed: 0.45, w: 20, h: HEIGHT / 5, halfW: 20 / 2, halfH: HEIGHT / 10 }; //custom
		this.#_leftPaddle = { x: 25, y: HEIGHT / 2 - this.#_paddleSpec.halfH };
		this.#_rightPaddle = {
			x: WIDTH - (this.#_paddleSpec.w + 25),
			y: HEIGHT / 2 - this.#_paddleSpec.halfH,
		};
		this.#_frameId = 0;
		this.#_delta = 0;
		this.#_lastFrameTime = 0;
		this.#_req = {
			_ID: 0,
			_keys: {
				w: false, s: false,	a: false, d: false,
				ArrowUp: false,	ArrowDown: false, ArrowLeft: false,	ArrowRight: false,
			},
			_timeStamp: 0,
		};
		this.#_reqHistory = new Map();
		this.#_replyHistory = new Array();
		this.#_leftStep = {x: 0, y: 0};
		this.#_rightStep = {x: 0, y: 0};
	}

	/*                              GETTERS                                  */
	get ball(): ballObj {
		return this.#_ball;
	}

	get leftPad(): coordinates {
		return this.#_leftPaddle;
	}

	get leftStep(): coordinates {
		return this.#_leftStep;
	}

	get rightPad(): coordinates {
		return this.#_rightPaddle;
	}

	get rightStep(): coordinates {
		return this.#_rightStep;
	}

	get padSpec(): paddleSpec {
		return this.#_paddleSpec;
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

	get horizontal(): boolean {
		return this.#_horizontal;
	}

	get reqHistory(): requestMap {
		return this.#_reqHistory;
	}

	get replyHistory(): replyTab {
		return this.#_replyHistory;
	}

	get score(): [number, number] {
		return this.#_score;
	}

	/*                              SETTERS                                  */
	set leftPad(newPos: paddleObj) {
	    this.#_leftPaddle = { ...newPos.coord };
		this.#_leftStep = { ...newPos.step }
	}

	set rightPad(newPos: paddleObj) {
	    this.#_rightPaddle = { ...newPos.coord };
	    this.#_rightStep = { ...newPos.step };
	}

	set ball(ball: ballObj) {
		this.#_ball = { ...ball };
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
    public updateScore(latestReply: repObj) {
		this.#_score = { ...latestReply._score };
        this.#_ui.scoreboard.player1Score = this.#_score[0];
        this.#_ui.scoreboard.player2Score = this.#_score[1];
    }

	public setLeftStep() {
	    this.#_leftStep = { x: 0, y: 0 };
	}

	public setRightStep() {
	    this.#_rightStep = { x: 0, y: 0 };
	}
	
	public addReq(req: reqObj) {
		const newReq: reqObj = {
			_ID: req._ID,
			_keys: { ...req._keys },
			_timeStamp: req._timeStamp,
		};
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
		const newReply: repObj = {
			_ID: reply._ID,
			_timestamp: reply._timestamp,
			_leftPad: { ...reply._leftPad },
			_rightPad: { ...reply._rightPad },
			_ball: { ...reply._ball },
			_score: { ...reply._score },
			_end: reply._end
		};
		this.#_replyHistory.push(newReply);
	}

	public deleteReplies(length: number) {
		this.#_replyHistory.splice(0, length);
	}

	public getReplies(renderTime: number): [repObj, repObj] | null {
		for (let i = 0; i < this.#_replyHistory.length - 1; i++) {
			if (
				this.#_replyHistory[i]!._timestamp <= renderTime &&
				this.#_replyHistory[i + 1]!._timestamp >= renderTime
			)
				return [this.#_replyHistory[i]!, this.#_replyHistory[i + 1]!];
		} //TODO: fix !
		return null;
	}
}
