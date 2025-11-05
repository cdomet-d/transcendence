import { Game, HEIGHT, WIDTH } from "./game.class.js";

export function renderGame(game: Game) {
	drawMiddleLine(game);
	drawPaddle(game);
	drawBall(game);
}

function drawPaddle(game: Game) {
	game.ctx.fillRect(game.leftPad.x, game.leftPad.y, game.padSpec.width, game.padSpec.height);
	game.ctx.fillRect(game.rightPad.x, game.rightPad.y, game.padSpec.width, game.padSpec.height);
}

function drawMiddleLine(game: Game) {
	game.ctx.beginPath();
	game.ctx.moveTo(WIDTH / 2, 0);
	game.ctx.lineTo(WIDTH / 2, HEIGHT);
	game.ctx.stroke();
}

function drawBall(game: Game) {
	game.ctx.beginPath();
	game.ctx.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2, false);
	game.ctx.fill();
}
