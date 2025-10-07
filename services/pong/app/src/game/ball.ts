import { HEIGHT, WIDTH, type ballObj } from "../classes/game.class.js";
import type { coordinates, Player } from "../classes/player.class.js";

export function updateBallPos(ball: ballObj, player: Player, opponent: Player, delta: number): boolean {
	let newX: number = ball.x + (ball.dx * delta);
	let newY: number = ball.y + (ball.dy * delta);

	if (newX - 10 > WIDTH || newX + 10 < 0) {
		if (updateScore(player, opponent, newX))
			return true;
		ball.x = WIDTH / 2;
		ball.y = HEIGHT / 2;
		return false;
	}

	if ((newY + 10) > HEIGHT || (newY - 10) < 0 ) {
		ball.dy *= -1;
		newY = ball.y + (ball.dy * delta);
	}
	if (touchesPad(player.paddle, opponent.paddle, newX, newY)) {
		ball.dx *= -1;
		newX = ball.x + (ball.dx * delta);
	}

	ball.x = newX;
	ball.y = newY;
	return false
}

const maxScore: number = 3;

function updateScore(player: Player, opponent: Player, newX: number): boolean {
	if (newX - 10 > WIDTH) {
		player.incScore();
		console.log("PLAYER:", player.score);
	}
	if (newX + 10 < 0) {
		opponent.incScore();
		console.log("OPPONENT:", player.score);
	}
	if (player.score === maxScore || opponent.score === maxScore)
		return true;
	return false;
}

function touchesPad(leftPad: coordinates, rightPad: coordinates, newX: number, newY: number): boolean {
	if (newX + 10 > rightPad.x && (newY + 10 > rightPad.y && newY - 10 < rightPad.y + 54))
		return true;
	if (newX - 10 < leftPad.x && (newY + 1 > leftPad.y && newY - 1 < leftPad.y + 54))
		return true;
	//TODO: check top of paddle
	return false;
}
