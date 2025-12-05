export const HEIGHT = 558.9;
export const WIDTH = 1000;
import type { PongUI } from '../../web-elements/game/game-ui.js';
import type {
    reqObj,
    ballObj,
    paddleSpec,
    coordinates,
    repObj,
    paddleObj,
} from './game-interfaces.js';

export type requestMap = Map<number, reqObj>;
type replyTab = Array<repObj>;

export class Game {
    /*                             PROPERTIES                                */
    #ball: ballObj;
    #ctx: CanvasRenderingContext2D;
    #ui: PongUI;
    #delta: number;
    #frameId: number;
    #horizontal: boolean;
    #lastFrameTime: number;
    #leftPaddle: coordinates;
    #leftStep: coordinates;
    #local: boolean;
    #paddleSpec: paddleSpec;
    #replyHistory: replyTab;
    #req: reqObj;
    #reqHistory: requestMap;
    #rightPaddle: coordinates;
    #rightStep: coordinates;
    #score: [number, number];

    /*                            CONSTRUCTORS                               */
    constructor(ctx: CanvasRenderingContext2D, remote: boolean, horizontal: boolean, ui: PongUI) {
        this.#ctx = ctx;
        this.#ui = ui;
        if (remote) this.#local = false;
        else this.#local = true;
        this.#horizontal = horizontal;
        this.#score = [0, 0];
        this.#ball = {
            x: WIDTH / 2,
            y: HEIGHT / 2,
            dx: 0.50, //custom
            dy: 0.03, //custom
            maxSpeed: 0.90,
            r: 13,
        };
        this.#paddleSpec = { speed: 0.50, w: 20, h: HEIGHT / 5, halfW: 20 / 2, halfH: HEIGHT / 10 }; //custom
        this.#leftPaddle = { x: 25, y: HEIGHT / 2 - this.#paddleSpec.halfH };
        this.#rightPaddle = {
            x: WIDTH - (this.#paddleSpec.w + 25),
            y: HEIGHT / 2 - this.#paddleSpec.halfH,
        };
        this.#frameId = 0;
        this.#delta = 0;
        this.#lastFrameTime = 0;
        this.#req = {
            ID: 0,
            keys: {
                w: false,
                s: false,
                a: false,
                d: false,
                ArrowUp: false,
                ArrowDown: false,
                ArrowLeft: false,
                ArrowRight: false,
            },
            timeStamp: 0,
        };
        this.#reqHistory = new Map();
        this.#replyHistory = new Array();
        this.#leftStep = { x: 0, y: 0 };
        this.#rightStep = { x: 0, y: 0 };
    }

    /*                              GETTERS                                  */
    get ball(): ballObj {
        return this.#ball;
    }

    get leftPad(): coordinates {
        return this.#leftPaddle;
    }

    get leftStep(): coordinates {
        return this.#leftStep;
    }

    get rightPad(): coordinates {
        return this.#rightPaddle;
    }

    get rightStep(): coordinates {
        return this.#rightStep;
    }

    get padSpec(): paddleSpec {
        return this.#paddleSpec;
    }

    get req(): reqObj {
        return this.#req;
    }

    get ctx(): CanvasRenderingContext2D {
        return this.#ctx;
    }

    get frameId(): number {
        return this.#frameId;
    }

    get delta(): number {
        return this.#delta;
    }

    get lastFrameTime(): number {
        return this.#lastFrameTime;
    }

    get local(): boolean {
        return this.#local;
    }

    get horizontal(): boolean {
        return this.#horizontal;
    }

    get reqHistory(): requestMap {
        return this.#reqHistory;
    }

    get replyHistory(): replyTab {
        return this.#replyHistory;
    }

    get score(): [number, number] {
        return this.#score;
    }

    /*                              SETTERS                                  */
    set leftPad(newPos: paddleObj) {
        this.#leftPaddle = { ...newPos.coord };
        this.#leftStep = { ...newPos.step };
    }

    set rightPad(newPos: paddleObj) {
        this.#rightPaddle = { ...newPos.coord };
        this.#rightStep = { ...newPos.step };
    }

    set ball(ball: ballObj) {
        this.#ball = { ...ball };
    }

    set frameId(id: number) {
        this.#frameId = id;
    }

    set delta(val: number) {
        this.#delta = val;
    }

    set lastFrameTime(val: number) {
        this.#lastFrameTime = val;
    }

    /*                              METHODS                                  */
    public updateScore(latestReply: repObj) {
        this.#score = { ...latestReply.score };
        this.#ui.scoreboard.player1Score = this.#score[0];
        this.#ui.scoreboard.player2Score = this.#score[1];
    }

    public setLeftStep() {
        this.#leftStep = { x: 0, y: 0 };
    }

    public setRightStep() {
        this.#rightStep = { x: 0, y: 0 };
    }

    public addReq(req: reqObj) {
        const newReq: reqObj = { ID: req.ID, keys: { ...req.keys }, timeStamp: req.timeStamp };
        this.#reqHistory.set(req.ID, newReq);
    }

    public deleteReq(id: number) {
        for (const key of this.#reqHistory.keys()) {
            if (key <= id) {
                this.#reqHistory.delete(key);
            }
        }
    }

    public addReply(reply: repObj) {
        const newReply: repObj = {
            ID: reply.ID,
            timestamp: reply.timestamp,
            leftPad: { ...reply.leftPad },
            rightPad: { ...reply.rightPad },
            ball: { ...reply.ball },
            score: { ...reply.score },
            end: reply.end,
        };
        this.#replyHistory.push(newReply);
    }

    public deleteReplies(length: number) {
        this.#replyHistory.splice(0, length);
    }

    public getReplies(renderTime: number): [repObj, repObj] | null {
        for (let i = 0; i < this.#replyHistory.length - 1; i++) {
            if (
                this.#replyHistory[i]!.timestamp <= renderTime &&
                this.#replyHistory[i + 1]!.timestamp >= renderTime
            )
                return [this.#replyHistory[i]!, this.#replyHistory[i + 1]!];
        }
        return null;
    }
}
