import { Game, HEIGHT, WIDTH } from "../classes/game.class.js";
import type { coordinates, Player } from "../classes/player.class.js";
import { lineIntersection, cornerIntersection, updateVelocity } from "./ball.utils.js";

const TIME_STEP: number = 1000 / 60; // 60FPS
const MAX_SCORE: number = 5;

export function updateBallPos(game: Game, player1: Player, player2: Player): boolean {
	let newX: number = game.ball.x + (game.ball.dx * TIME_STEP);
	let newY: number = game.ball.y + (game.ball.dy * TIME_STEP);

	if (sideWallCollision(game, player1, player2, newX)) {
		if (player1.score === MAX_SCORE || player2.score === MAX_SCORE)
			return true;
		return false;
	}
	newY = upperAndBottomWallCollision(game, newY);
	if (paddleCollision(game, player1.paddle, newX, newY))
		return false;
	if (paddleCollision(game, player2.paddle, newX, newY))
		return false;

	game.ball.x = newX;
	game.ball.y = newY;
	return false;
}

function upperAndBottomWallCollision(game: Game, newY: number): number {
	if (newY - game.ball.radius <= 0) {
		newY = game.ball.radius + 1;
		game.ball.dy = updateVelocity(game.ball.dx, game.ball.dy, 0, 1)[1];
	}
	if (newY + game.ball.radius >= HEIGHT) {
		newY = HEIGHT - (game.ball.radius + 1);
		game.ball.dy = updateVelocity(game.ball.dx, game.ball.dy, 0, -1)[1];
	}
	return newY;
}

function sideWallCollision(game: Game, player1: Player, player2: Player, newX: number): boolean {
	if (newX - game.ball.radius >= WIDTH + 100 || newX + game.ball.radius <= -100) {
		updateScore(game, player1, player2, newX)
		game.ball.x = WIDTH / 2;
		game.ball.y = HEIGHT / 2;
		game.ball.dx = 0;
		game.ball.dy = 0;
		game.addTimoutID(setTimeout(() => {
			game.ball.dx = 0.3 * game.ballDir;
			game.ball.dy = 0.03;
			game.ballDir *= -1;
		}, 1000));
		return true;
	}
	return false;
}

function updateScore(game: Game, player1: Player, player2: Player, newX: number) {
	if (newX - game.ball.radius >= WIDTH) {
		player1.incScore();
		console.log("PLAYER:", player1.score, "ID:", player1.userID);
	}
	if (newX + game.ball.radius <= 0) {
		player2.incScore();
		console.log("OPPONENT:", player2.score, "ID:", player2.userID);
	}
}

export function paddleCollision(game: Game, paddle: coordinates, newX: number, newY: number): boolean {
	const side: string = getCollisionSide(game, paddle);
	
	if (sides(game, paddle, newX, newY, side))
		return true;
	return corners(game, paddle, newX, newY, side);
}

function sides(game: Game, paddle: coordinates, newX: number, newY: number, side: string): boolean {
	let newPos: coordinates | null;
	const p1: coordinates = {x: game.ball.x, y: game.ball.y};
	const p2: coordinates = {x: newX, y: newY};
	let p3: coordinates = {x: 0, y: 0};
	let p4: coordinates = {x: 0, y: 0};
	let n: coordinates = {x: 0, y: 0};

	const inflatedPad: coordinates = {x: paddle.x - game.ball.radius, y: paddle.y - game.ball.radius};
	const padHeight: number = game.padSpec.height + 2 * game.ball.radius;
	const padWidth: number = game.padSpec.width + 2 * game.ball.radius;

	switch (side) {
		case "left":
			p3 = inflatedPad;
			p4 = {x: inflatedPad.x, y: inflatedPad.y + padHeight};
			n = {x: -1, y: 0};
			break;
		case "right":
			p3 = {x: inflatedPad.x + padWidth, y: inflatedPad.y};
			p4 = {x: inflatedPad.x + padWidth, y: inflatedPad.y + padHeight};
			n = {x: 1, y: 0}
			break;
		case "top":
			p3 = inflatedPad;
			p4 = {x: inflatedPad.x + padWidth, y: inflatedPad.y};
			n = {x: 0, y: -1};
			newPos = lineIntersection(p1, p2, p3, p4);
			break;
		case "bottom":
			p3 = {x: inflatedPad.x, y: inflatedPad.y + padHeight};
			p4 = {x: inflatedPad.x + padWidth, y: inflatedPad.y + padHeight};
			n = {x: 0, y: 1};
			break;
	}
	newPos = lineIntersection(p1, p2, p3, p4);
	if (!newPos) return false;
	[game.ball.dx, game.ball.dy] = updateVelocity(game.ball.dx, game.ball.dy, n.x, n.y);
	[game.ball.x, game.ball.y] = [newPos.x + 1 * n.x, newPos.y + 1 * n.y];
	return true;
}

function corners(game: Game, paddle: coordinates, newX: number, newY: number, side: string): boolean {
	const offset: number = game.ball.radius;// + 1;
	const topright: coordinates = {x: paddle.x + game.padSpec.width + offset, y: paddle.y - offset};
	const topleft: coordinates = {x: paddle.x - offset, y: paddle.y - offset};
	const bottomright: coordinates = {x: paddle.x + game.padSpec.width + offset, y: paddle.y + game.padSpec.height + offset};
	const bottomleft: coordinates = {x: paddle.x - offset, y: paddle.y + game.padSpec.height + offset};
	let corner: coordinates = {x: 0, y: 0};

	switch (side) {
		case "topright":
			corner = topright;
			break;
		case "topleft":
			corner = topleft;
			break;
		case "bottomright":
			corner = bottomright;
			break;
		case "bottomleft":
			corner = bottomleft;
			break;
		default:
			return false;
	}
	if (cornerIntersection(game, paddle, newX, newY, corner)) {
		[game.ball.x, game.ball.y] = [corner.x + 1, corner.y + 1];
		return true;
	}
	return false;
}

function getCollisionSide(game: Game, paddle: coordinates): string {
    const padCenterX = paddle.x + game.padSpec.halfWidth;
    const padCenterY = paddle.y + game.padSpec.halfHeight;

    const dx = game.ball.x - padCenterX;
    const dy = game.ball.y - padCenterY;

    const normalizedX = dx / game.padSpec.halfWidth;
    const normalizedY = dy / game.padSpec.halfHeight;

    const absX = Math.abs(normalizedX);
    const absY = Math.abs(normalizedY);

    const cornerThreshold = 0.1;

    if (Math.abs(absX - absY) < cornerThreshold) {
        if (dx > 0) 
			return dy < 0 ? "topright" : "bottomright";
        else
			return dy < 0 ? "topleft" : "bottomleft";
    }
	if (absX > absY)
        return dx > 0 ? "right" : "left";
    else
        return dy > 0 ? "bottom" : "top";
}
