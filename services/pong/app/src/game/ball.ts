import { Game, HEIGHT, WIDTH, type ballObj } from "../classes/game.class.js";
import type { coordinates, Player } from "../classes/player.class.js";

const TIME_STEP: number = 1000 / 60; // 60FPS
const MAX_SCORE: number = 5;
const BALL_RADIUS: number = 10;

export function updateBallPos(game: Game, player1: Player, player2: Player): boolean {
	let newX: number = game.ball.x + (game.ball.dx * TIME_STEP);
	let newY: number = game.ball.y + (game.ball.dy * TIME_STEP);

	if (newX - BALL_RADIUS >= WIDTH + 100 || newX + BALL_RADIUS <= -100) {
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

	if ((newY + BALL_RADIUS) >= HEIGHT || (newY - BALL_RADIUS) <= 0) {
		[game.ball.dy, game.ball.dx] = increaseVelocity(game.ball.dy, game.ball.dx);
		newX = game.ball.x + (game.ball.dx * TIME_STEP);
		newY = game.ball.y + (game.ball.dy * TIME_STEP);
	}
	if (paddleCollision(player1.paddle, player2.paddle, newX, newY)) {
		[game.ball.dx, game.ball.dy] = increaseVelocity(game.ball.dx, game.ball.dy);
		newY = game.ball.y + (game.ball.dy * TIME_STEP);
		newX = game.ball.x + (game.ball.dx * TIME_STEP);
	}

	game.ball.x = newX;
	game.ball.y = newY;
	return false;
}

function increaseVelocity(v1: number, v2: number): [number, number] {
	if (v1 > 0.5 || v1 < -0.5)
		v1 *= -1;
	else
		v1 *= -1.1;
	if (v2 <= 0.5 && v2 >= -0.5)
		v2 *= 1.1;
	return [v1, v2];
}

function updateScore(player1: Player, player2: Player, newX: number): boolean {
	if (newX - BALL_RADIUS >= WIDTH) {
		player1.incScore();
		console.log("PLAYER:", player1.score);
	}
	if (newX + BALL_RADIUS <= 0) {
		player2.incScore();
		console.log("OPPONENT:", player2.score);
	}
	if (player1.score === MAX_SCORE || player2.score === MAX_SCORE)
		return true;
	return false;
}

function paddleCollision(leftPad: coordinates, rightPad: coordinates, newX: number, newY: number): boolean {
	if (newX + BALL_RADIUS >= rightPad.x 
		&& newX - BALL_RADIUS <= rightPad.x + BALL_RADIUS
		&& newY + BALL_RADIUS >= rightPad.y 
		&& newY - BALL_RADIUS <= rightPad.y + 54)
		return true;
	if (newX - BALL_RADIUS <= leftPad.x + BALL_RADIUS 
		&& newX + BALL_RADIUS >= leftPad.x 
		&& newY + BALL_RADIUS >= leftPad.y 
		&& newY - BALL_RADIUS <= leftPad.y + 54)
		return true;
	//TODO: check top of paddle
	return false;
}
