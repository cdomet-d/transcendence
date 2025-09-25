import { Game } from "./game.class.js";

export function renderGame(game: Game) {
	drawMiddleLine(game);
	drawPaddle(game);
	drawBall(game);
}

function drawPaddle(game: Game) {
	game.ctx.fillRect(game.leftPad.x, game.leftPad.y, 10, 54);
	game.ctx.fillRect(game.rightPad.x, game.rightPad.y, 10, 54);
}

function drawMiddleLine(game: Game) {
	game.ctx.beginPath();
	game.ctx.moveTo(game.width / 2, 0);
	game.ctx.lineTo(game.width / 2, game.height);
	game.ctx.stroke();
}

function drawBall(game: Game) {
	game.ctx.beginPath();
	game.ctx.arc(game.width / 2, game.height / 2, 10, 0, Math.PI * 2, false);
	game.ctx.fill();
}

