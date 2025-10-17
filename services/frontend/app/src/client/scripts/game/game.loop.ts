import { createKeyDownEvent, createKeyUpEvent, addMessEvent } from "./game.events.js";
import { renderGame } from "./game.render.utils.js";
import { Game, HEIGHT, WIDTH } from "./game.class.js";
import { updatePaddlePos } from "./paddle.js";
import { updateBallPos } from "./ball.js";
import type { coordinates, repObj, startObj } from "./mess.validation.js";

const TIME_STEP: number = 1000 / 60; // 60FPS

export async function startGame(game: Game, ws: WebSocket) {
	//send client timestamp
	ws.send(JSON.stringify(performance.now()));

	// wait for server timestamp and delay
	const start: startObj = await waitForMessage(ws);
	const recvTime: number = performance.now();
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
		const latestReply: repObj | undefined = game.replyHistory[game.replyHistory.length - 1];

		//reconciliation
		if (latestReply !== undefined && game.reqHistory.has(latestReply._ID))
			reconciliation(game, latestReply);

		//prediction
		game.delta += (timestamp - game.lastFrameTime);
		game.lastFrameTime = timestamp;
		while (game.delta >= TIME_STEP) { //TODO: add update limit
			updatePaddlePos(game, game.req._keys, TIME_STEP);
			game.delta -= TIME_STEP;
		}

		// interpolation and dead reckoning
		interpolation(game, latestReply);

		//req to server
		game.req._timeStamp = performance.now() + offset;
		ws.send(JSON.stringify(game.req));
		game.addReq(game.req);
		game.req._ID += 1; //TODO: overflow

		//new frame
		game.ctx.clearRect(0, 0, WIDTH, HEIGHT);
		renderGame(game);
		game.frameId = window.requestAnimationFrame(FrameRequestCallback(game, ws, offset));
	}
}

function interpolation(game: Game, latestReply: repObj | undefined) {
	const renderTime: number = performance.now() - 100; //TODO: put 100 in a var
	const updates: [repObj, repObj] | null = game.getReply(renderTime);

	if (updates) {
		console.log("IN INTERPOLATION");
		const t = (renderTime - updates[0]._timestamp) / 
					(updates[1]._timestamp - updates[0]._timestamp);
		if (!game.local)
			game.rightPad.y = lerp(updates[0]._rightPad.y, updates[1]._rightPad.y, t);
		game.ball.x = lerp(updates[0]._ball.x, updates[1]._ball.x, t),
		game.ball.y = lerp(updates[0]._ball.y, updates[1]._ball.y, t)
		game.deleteReplies(game.replyHistory.indexOf(updates[0]) - 1);
	}
	else if (latestReply !== undefined)
		deadReckoning(game, latestReply);
}

function lerp(start: number, end: number, t: number): number {
    return start + Math.min(Math.max(t, 0), 1) * (end - start);
}

function deadReckoning(game: Game, latestReply: repObj) {
	console.log("IN DEADRECKONING");
	let timeSinceUpdate: number = 0;
	timeSinceUpdate = (performance.now() - latestReply._timestamp)
	if (timeSinceUpdate > 200)
		timeSinceUpdate = 200
	timeSinceUpdate /= 1000;
	game.ball.x = latestReply._ball.x + latestReply._ball.dx * timeSinceUpdate;
	game.ball.y = latestReply._ball.y + latestReply._ball.dy * timeSinceUpdate;
}

function reconciliation(game: Game, latestReply: repObj) {
	console.log("IN RECONCILIATION")
	const id: number = latestReply._ID;
	game.deleteReq(id);

	game.leftPad.y = latestReply._leftPad.y;
	if (game.local)
		game.rightPad.y = latestReply._rightPad.y;

	for (let i = id + 1; game.reqHistory.has(i); i++) {
		updatePaddlePos(game, game.reqHistory.get(i)!._keys, TIME_STEP)
	}
}
