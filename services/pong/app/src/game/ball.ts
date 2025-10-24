import { HEIGHT, WIDTH, type ballObj } from "../classes/game.class.js";
import type { coordinates, Player } from "../classes/player.class.js";

const TIME_STEP: number = 1000 / 60; // 60FPS
const MAX_SCORE: number = 5;

export function updateBallPos(ball: ballObj, player1: Player, player2: Player): boolean {
	let newX: number = ball.x + (ball.dx * TIME_STEP);
	let newY: number = ball.y + (ball.dy * TIME_STEP);

	if (newX - 10 >= WIDTH || newX + 10 <= 0) {
		if (updateScore(player1, player2, newX))
			return true;
		ball.x = WIDTH / 2;
		ball.y = HEIGHT / 2;
		// if (ball.dx === ball.lastdx)
		// 	ball.dx *= -1;
		// if (ball.dy < 0)
		// 	ball.dy *= -1;
		// ball.lastdx = ball.dx;
		ball.dx = 0;
		ball.lastdx = 0;
		ball.dy = 0;
		setTimeout(() => {
			ball.dx = 0.3;
			ball.lastdx = 0.3;
			ball.dy = 0.025;
		}, 1000);
		return false;
	}

	if ((newY + 10) >= HEIGHT || (newY - 10) <= 0 ) {
		ball.dy *= -1;
		newY = ball.y + (ball.dy * TIME_STEP);
	}
	if (paddleCollision(player1.paddle, player2.paddle, newX, newY)) {
		ball.dx *= -1;
		newX = ball.x + (ball.dx * TIME_STEP);
	}

	ball.x = newX;
	ball.y = newY;
	return false
}

function updateScore(player1: Player, player2: Player, newX: number): boolean {
	if (newX - 10 >= WIDTH) {
		player1.incScore();
		console.log("PLAYER:", player1.score);
	}
	if (newX + 10 <= 0) {
		player2.incScore();
		console.log("OPPONENT:", player2.score);
	}
	if (player1.score === MAX_SCORE || player2.score === MAX_SCORE)
		return true;
	return false;
}

export function paddleCollision(leftPad: coordinates, rightPad: coordinates, newX: number, newY: number): boolean {
	if (touchesRightPad(rightPad, newX, newY))
		return true;
	if (touchesLeftPad(leftPad, newX, newY))
		return true;
	//TODO: check top of paddle
	return false;
}

export function touchesRightPad(rightPad: coordinates, newX: number, newY: number): boolean {
	//TODO: fix 460
	if (newX + 10 >= 460 && (newY + 10 >= rightPad.y && newY - 10 <= rightPad.y + 54))
		return true;
	return false
}

export function touchesLeftPad(leftPad: coordinates, newX: number, newY: number): boolean {
	if (newX - 10 <= leftPad.x + 10 && (newY + 10 >= leftPad.y && newY - 10 <= leftPad.y + 54))
		return true;
	return false;
}