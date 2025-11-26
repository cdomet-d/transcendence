import { renderGame } from './game-render-utils.js';
import { Game, HEIGHT, WIDTH } from './classes/game-class.js';
import type { repObj } from './classes/game-interfaces.js';
import { movePaddle, updatePaddlePos } from './paddle.js';
import { deadReckoning } from './ball.js';

const SERVER_TICK: number = 1000 / 50;
const TIME_STEP: number = 1000 / 60;
const MAX_UPDATES_PER_FRAME = 8;

export async function startGame(game: Game, ws: WebSocket) {
	game.lastFrameTime = performance.now();
	game.frameId = requestAnimationFrame(FrameRequestCallback(game, ws));
}

function FrameRequestCallback(game: Game, ws: WebSocket) {
	return function gameLoop(timestamp: number) {
		const latestReply: repObj | undefined = game.replyHistory[game.replyHistory.length - 1];
		if (latestReply !== undefined && game.reqHistory.has(latestReply._ID))
			if (reconciliation(game, latestReply, ws))
				return;

		game.delta += timestamp - game.lastFrameTime;
		game.lastFrameTime = timestamp;
		let updates: number = 0;
		while (game.delta >= TIME_STEP && updates < MAX_UPDATES_PER_FRAME) {
			sendRequest(game, ws);
			updatePaddlePos(game.leftPad, true, game, game.req._keys);
			if (game.local) 
				updatePaddlePos(game.rightPad, false, game, game.req._keys);
			else 
				interpolation(game);
			deadReckoning(game, latestReply);
			finishSteps(game);
			game.delta -= TIME_STEP;
			updates++;
		}
		if (updates === MAX_UPDATES_PER_FRAME) 
			game.delta = 0;

		game.ctx.clearRect(0, 0, WIDTH, HEIGHT);
		renderGame(game);
		game.frameId = window.requestAnimationFrame(FrameRequestCallback(game, ws));
	};
}

function sendRequest(game: Game, ws: WebSocket) {
	game.req._timeStamp = performance.now();
	ws.send(JSON.stringify(game.req));
	game.addReq(game.req);
	game.req._ID += 1; //TODO: overflow?
}

function interpolation(game: Game) {
	const renderTime: number = performance.now() - SERVER_TICK;
	const updates: [repObj, repObj] | null = game.getReplies(renderTime);

	if (updates) {
		const t =
			(renderTime - updates[0]._timestamp) / (updates[1]._timestamp - updates[0]._timestamp);
		game.rightPad.y = lerp(updates[0]._rightPad.coord.y, updates[1]._rightPad.coord.y, t);
		if (game.horizontal)
			game.rightPad.x = lerp(updates[0]._rightPad.coord.x, updates[1]._rightPad.coord.x, t);
		game.deleteReplies(game.replyHistory.indexOf(updates[0]) - 1);
	}
}

function lerp(start: number, end: number, t: number): number {
	return start + (end - start) * Math.min(Math.max(t, 0), 1);
}

function reconciliation(game: Game, latestReply: repObj, ws: WebSocket): boolean {
	let id: number = latestReply._ID;
	game.deleteReq(id);

	if (latestReply._score[0] != game.score[0] 
		|| latestReply._score[1] != game.score[1])
		game.updateScore(latestReply);
	game.leftPad = latestReply._leftPad;
	if (game.local)
		game.rightPad = latestReply._rightPad;
	game.ball = latestReply._ball;

	if (game.leftStep.x != 0 || game.leftStep.y != 0
		|| game.rightStep.x != 0 || game.rightStep.y != 0) {
		deadReckoning(game, undefined);
		finishSteps(game);
	}
	for (let i = id + 1; game.reqHistory.has(i); i++) {
		updatePaddlePos(game.leftPad, true, game, game.reqHistory.get(i)!._keys);
		if (game.local) 
			updatePaddlePos(game.rightPad, false, game, game.reqHistory.get(i)!._keys);
		deadReckoning(game, latestReply);
		finishSteps(game);
	}
	if (latestReply._end === true) {
		ws.send("0");
		return true;
	}
	return false;
}

function finishSteps(game: Game) {
	if (game.leftStep.x != 0 || game.leftStep.y != 0) {
		movePaddle(game, game.leftPad, game.leftStep);
		game.setLeftStep();
	}
	if (game.local) {
		if (game.rightStep.x != 0 || game.rightStep.y != 0) {
			movePaddle(game, game.rightPad, game.rightStep);
			game.setRightStep();
		}
	}
}

