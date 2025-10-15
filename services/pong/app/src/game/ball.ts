import { HEIGHT, WIDTH, type ballObj } from "../classes/game.class.js";
import type { coordinates, Player } from "../classes/player.class.js";

export function updateBallPos(ball: ballObj, player1: Player, player2: Player, delta: number): boolean {
	let newX: number = ball.x + (ball.dx * delta);
	let newY: number = ball.y + (ball.dy * delta);

	if (newX - 10 >= WIDTH || newX + 10 <= 0) {
		if (updateScore(player1, player2, newX))
			return true;
		ball.x = WIDTH / 2;
		ball.y = HEIGHT / 2;
		if (ball.dx === ball.lastdx)
			ball.dx *= -1;
		ball.lastdx = ball.dx;
		return false;
	}

	if ((newY + 10) >= HEIGHT || (newY - 10) <= 0 ) {
		ball.dy *= -1;
		newY = ball.y + (ball.dy * delta);
	}
	if (touchesPad(player1.paddle, player2.paddle, newX, newY)) {
		ball.dx *= -1;
		newX = ball.x + (ball.dx * delta);
	}

	ball.x = newX;
	ball.y = newY;
	return false
}

const maxScore: number = 3;

function updateScore(player1: Player, player2: Player, newX: number): boolean {
	if (newX - 10 >= WIDTH) {
		player1.incScore();
		console.log("PLAYER:", player1.score);
	}
	if (newX + 10 <= 0) {
		player2.incScore();
		console.log("OPPONENT:", player2.score);
	}
	if (player1.score === maxScore || player2.score === maxScore)
		return true;
	return false;
}

function touchesPad(leftPad: coordinates, rightPad: coordinates, newX: number, newY: number): boolean {
	//TODO: fix 460
	if (newX + 10 >= 460 && (newY + 10 >= rightPad.y && newY - 10 <= rightPad.y + 54))
		return true;
	if (newX - 10 <= leftPad.x + 10 && (newY + 10 >= leftPad.y && newY - 10 <= leftPad.y + 54))
		return true;
	//TODO: check top of paddle
	return false;
}
