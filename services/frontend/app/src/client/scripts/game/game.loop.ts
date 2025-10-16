import { createKeyDownEvent, createKeyUpEvent, addMessEvent } from "./game.events.js";
import { renderGame } from "./game.render.utils.js";
import { Game, HEIGHT, WIDTH } from "./game.class.js";
import { updatePaddlePos } from "./paddle.js";
import { updateBallPos } from "./ball.js";
import type { startObj } from "./mess.validation.js";

const TIME_STEP: number = 1000 / 60; // 60FPS

export async function startGame(game: Game, ws: WebSocket) {
	//send client timestamp
	ws.send(JSON.stringify(Date.now()));

	// wait for server timestamp and delay
	const start: startObj = await waitForMessage(ws);
	const recvTime: number = Date.now();
	const halfTripTime: number = (recvTime - start.clientTimeStamp) / 2;
	const offset: number = start.serverTimeStamp + halfTripTime - recvTime;

	// wait
	setUpGame(game, ws, start);
	const waitTime = Math.max(0, start.delay - halfTripTime);
	await new Promise(res => setTimeout(res, waitTime));

	// start game
	game.frameId = requestAnimationFrame((timestamp) => {
		game.lastFrameTime = timestamp;
		game.frameId = requestAnimationFrame(FrameRequestCallback(game, ws, offset));
	});
}

function setUpGame(game: Game, ws: WebSocket, start: startObj) {
	game.ball.dx *= start.ballDir;
	game.ball.lastdx *= start.ballDir;
	addMessEvent(game, ws);
	window.addEventListener("keydown", createKeyDownEvent(game.req._keys));
	window.addEventListener("keyup", createKeyUpEvent(game.req._keys));
}

function waitForMessage(socket: WebSocket): Promise< startObj > {
	return new Promise((resolve, reject) => {
		socket.addEventListener('message', (event) => {
			try {
				const start: startObj = JSON.parse(event.data);
				// if (!validStart())
				// 	reject(new Error("Invalid start"));
				resolve(start);
			} catch (err) {
				reject(err);
			}
		}, { once: true });
	});
}

function FrameRequestCallback(game: Game, ws: WebSocket, offset: number) {
	return function gameLoop(timestamp: number) {
		//reconciliation
		if (game.reqHistory.has(game.servReply._ID))
			reconciliation(game);

		//prediction
		game.delta += (timestamp - game.lastFrameTime);
		game.lastFrameTime = timestamp;
		while (game.delta >= TIME_STEP) { //TODO: add update limit
			updatePaddlePos(game, game.req._keys, TIME_STEP);
			updateBallPos(game, TIME_STEP);
			game.delta -= TIME_STEP;
		}

		//req to server
		game.req._timeStamp = Date.now() + offset;
		ws.send(JSON.stringify(game.req));
		game.addReq(game.req);
		game.req._ID += 1; //TODO: overflow

		//new frame
		game.ctx.clearRect(0, 0, WIDTH, HEIGHT);
		renderGame(game);
		game.frameId = window.requestAnimationFrame(FrameRequestCallback(game, ws, offset));
	}
}

function reconciliation(game: Game) {
	const id: number = game.servReply._ID;
	game.deleteReq(id);

	game.leftPad.y = game.servReply._leftPaddle.y;
	game.rightPad.y = game.servReply._rightPaddle.y;
	game.ball.x = game.servReply._ball.x;
	game.ball.y = game.servReply._ball.y;

	for (let i = id + 1; game.reqHistory.has(i); i++) {
		updatePaddlePos(game, game.reqHistory.get(i)!._keys, TIME_STEP)
		updateBallPos(game, TIME_STEP);
	}
}
