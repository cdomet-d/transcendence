import { paddleObj } from "../classes/player.class.js";
import type { CanvasRenderingContext2D } from 'canvas'
const width = 480
const height = 270

export function renderGame(ctx: CanvasRenderingContext2D, leftPad: paddleObj, rightPad: paddleObj) {
	drawMiddleLine(ctx);
	drawPaddle(ctx, leftPad, rightPad);
	drawBall(ctx);
}

function drawPaddle(ctx: CanvasRenderingContext2D, leftPad: paddleObj, rightPad: paddleObj) {
	ctx.fillRect(leftPad.x, leftPad.y, 10, 54); //TODO: initialise 10 and 54 in game class
	ctx.fillRect(rightPad.x, rightPad.y, 10, 54);
}

function drawMiddleLine(ctx: CanvasRenderingContext2D) {
	ctx.beginPath();
	ctx.moveTo(width / 2, 0);
	ctx.lineTo(width / 2, height);
	ctx.stroke();
}

function drawBall(ctx: CanvasRenderingContext2D) {
	ctx.beginPath();
	ctx.arc(width / 2, height / 2, 10, 0, Math.PI * 2, false);
	ctx.fill();
}
