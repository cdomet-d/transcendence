import { createKeyDownEvent, createKeyUpEvent, addMessEvent } from "./paddle.js";

const WIDTH = 480;
const HEIGHT = 270;

export interface keysObj {
	_w: boolean,
	_s: boolean,
	_ArrowUp: boolean,
	_ArrowDown: boolean,
	// [key: string]: boolean,
}

export interface messObj {
	_keys: keysObj,
	_timeStamp: number,
}

export interface paddlePos {
	x: number;
	y: number;
}

export let leftPad: paddlePos = {x: 10, y: 108};
export let rightPad: paddlePos = {x: 460, y: 108};

function pong() {
	const ctx = getCanvasContext();
	renderGame(ctx);
	import("./wsreply.js").then(({ wsRequest }) => {
        wsRequest();
    }) //TODO: can import fail ?
}

export function initGame(ws: WebSocket) {
	const ctx = getCanvasContext();
	let keys: keysObj = {_w: false, _s: false, _ArrowUp: false, _ArrowDown: false};
	let mess: messObj = { _keys: keys, _timeStamp: 0 };

	window.addEventListener("keydown", createKeyDownEvent(mess._keys));
	window.addEventListener("keyup", createKeyUpEvent(mess._keys));
	addMessEvent(leftPad, rightPad, ws);
	window.requestAnimationFrame(FrameRequestCallback(ctx, ws, mess));
}

function FrameRequestCallback(ctx: CanvasRenderingContext2D, ws: WebSocket, mess: messObj) {
	return function game(timestamp: number) {
		mess._timeStamp = timestamp;
		ws.send(JSON.stringify(mess));
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		renderGame(ctx);
		window.requestAnimationFrame(FrameRequestCallback(ctx, ws, mess));
	}
}

export function getCanvasContext(): CanvasRenderingContext2D {
	const canvas = document.getElementById("canvas") as HTMLCanvasElement;
	const ctx = canvas.getContext('2d');
	if (ctx === null) {
		console.log("error: context not supported");
		process.exit(1); //TODO: can't exit
	}
	return ctx;
}

function renderGame(ctx: CanvasRenderingContext2D) {
	drawMiddleLine(ctx);
	drawPaddle(ctx);
	drawBall(ctx);
}

export function drawPaddle(ctx: CanvasRenderingContext2D) {
	ctx.fillRect(leftPad.x, leftPad.y, 10, 54);
	ctx.fillRect(rightPad.x, rightPad.y, 10, 54);
}

function drawMiddleLine(ctx: CanvasRenderingContext2D) {
	ctx.beginPath();
	ctx.moveTo(WIDTH / 2, 0);
	ctx.lineTo(WIDTH / 2, HEIGHT);
	ctx.stroke();
}

function drawBall(ctx: CanvasRenderingContext2D) {
	ctx.beginPath();
	ctx.arc(WIDTH / 2, HEIGHT / 2, 10, 0, Math.PI * 2, false);
	ctx.fill();
}


// window.addEventListener("load", );

export { pong };