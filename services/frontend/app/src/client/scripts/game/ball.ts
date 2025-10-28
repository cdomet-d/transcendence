import { Game, HEIGHT, type ballObj } from "./game.class.js";
import type { coordinates, repObj } from "./mess.validation.js";

const TIME_STEP: number = 1000 / 60; // 60FPS

export function deadReckoning(game: Game, latestReply: repObj | undefined) {
	console.log("IN DEADRECKONING");
	let timeSinceUpdate: number = performance.now() - game.lastFrameTime; //TIME_STEP;
	let ball: ballObj = { ...game.ball };
	if (latestReply !== undefined) {
		timeSinceUpdate = (performance.now() - latestReply._timestamp)
		ball = latestReply._ball;
	}
	if (timeSinceUpdate > 100) //TODO: add var for 100
		timeSinceUpdate = 100
	let newX: number = ball.x + ball.dx * timeSinceUpdate;
	let newY: number = ball.y + ball.dy * timeSinceUpdate;
	updateBallPos(game, newX, newY);
}

function updateBallPos(game: Game, newX: number, newY: number): boolean {
	if ((newY + 10) >= HEIGHT || (newY - 10) <= 0 ) {
		if (game.ball.dy >= 0.5 || game.ball.dy <= -0.5)
			game.ball.dy *= -1;
		else
			game.ball.dy *= -1.1;
		if (game.ball.dx <= 0.5 && game.ball.dx >= -0.5) {
			game.ball.dx *= 1.1;
			newX = game.ball.x + (game.ball.dx * TIME_STEP);
		}
		newY = game.ball.y + (game.ball.dy * TIME_STEP);
	}
	if (paddleCollision(game.leftPad, game.leftPad, newX, newY)) {
		if (game.ball.dx >= 0.5 || game.ball.dx <= -0.5)
			game.ball.dx *= -1;
		else
			game.ball.dx *= -1.1;
		if (game.ball.dy <= 0.5 && game.ball.dy >= -0.5) {
			game.ball.dy *= 1.1;
			newY = game.ball.y + (game.ball.dy * TIME_STEP);
		}
		newX = game.ball.x + (game.ball.dx * TIME_STEP);
	}
	game.ball.x = newX;
	game.ball.y = newY;
	return false;
}

function paddleCollision(leftPad: coordinates, rightPad: coordinates, newX: number, newY: number): boolean {
	if (newX + 10 >= rightPad.x && newX - 10 <= rightPad.x + 10 
		&& newY + 10 >= rightPad.y && newY - 10 <= rightPad.y + 54)
		return true;
	if (newX - 10 <= leftPad.x + 10 && newX + 10 >= leftPad.x 
		&& newY + 10 >= leftPad.y && newY - 10 <= leftPad.y + 54)
		return true;
	//TODO: check top of paddle
	return false;
}
