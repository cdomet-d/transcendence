import { Game, HEIGHT, WIDTH, type ballObj } from "../classes/game.class.js";
import type { coordinates, Player } from "../classes/player.class.js";

const TIME_STEP: number = 1000 / 60; // 60FPS
const MAX_SCORE: number = 5;

export function updateBallPos(game: Game, player1: Player, player2: Player): boolean {
	let newX: number = game.ball.x + (game.ball.dx * TIME_STEP);
	let newY: number = game.ball.y + (game.ball.dy * TIME_STEP);

	if (newX - 10 >= WIDTH + 100 || newX + 10 <= -100) {
		if (updateScore(player1, player2, newX))
			return true;
		game.ball.x = WIDTH / 2;
		game.ball.y = HEIGHT / 2;
		game.ball.dx = 0;
		game.ball.dy = 0;
		setTimeout(() => {
			game.ball.dx = 0.3 * game.ballDir;
			game.ball.dy = 0.025;
			game.ballDir *= -1;
		}, 500);
		return false;
	}

	if ((newY + 10) >= HEIGHT || (newY - 10) <= 0 ) {
		game.ball.dy *= -1;
		newY = game.ball.y + (game.ball.dy * TIME_STEP);
	}
	if (paddleCollision(player1.paddle, player2.paddle, newX, newY)) {
		game.ball.dx *= -1;
		newX = game.ball.x + (game.ball.dx * TIME_STEP);
	}

	game.ball.x = newX;
	game.ball.y = newY;
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

function paddleCollision(leftPad: coordinates, rightPad: coordinates, newX: number, newY: number): boolean {
	if (newX + 10 >= 460 && newX - 10 <= 470 
		&& newY + 10 >= rightPad.y && newY - 10 <= rightPad.y + 54)
		return true;
	if (newX - 10 <= leftPad.x + 10 && newX + 10 >= leftPad.x 
		&& newY + 10 >= leftPad.y && newY - 10 <= leftPad.y + 54)
		return true;
	//TODO: check top of paddle
	return false;
}
