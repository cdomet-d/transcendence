import { Game, HEIGHT, WIDTH } from "../classes/game.class.js";
import type { coordinates, Player } from "../classes/player.class.js";

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
	if (leftPadCollision(game, player1.paddle, newX, newY))
		return false;
	if (rightPadCollision(game, player2.paddle, newX, newY))
		return false;

	game.ball.x = newX;
	game.ball.y = newY;
	return false;
}

function upperAndBottomWallCollision(game: Game, newY: number): number {
	if (newY - game.ball.radius <= 0) {
		newY = game.ball.radius + 1;
		game.ball.dy = incVelocity(game.ball.dx, Math.abs(game.ball.dy))[1];
	}
	if (newY + game.ball.radius >= HEIGHT) {
		newY = HEIGHT - (game.ball.radius + 1);
		game.ball.dy = incVelocity(game.ball.dx, -Math.abs(game.ball.dy))[1];
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

export function leftPadCollision(game: Game, leftPad: coordinates, newX: number, newY: number): boolean {
	const ball: coordinates = {
		x: newX - (leftPad.x + game.padSpec.halfWidth), 
		y: newY - (leftPad.y + game.padSpec.halfHeight)
	};
	const paddle: coordinates = {
		x: game.padSpec.halfWidth, 
		y: game.padSpec.halfHeight
	};
	if (distBallPad(ball, paddle) <= game.ball.radius) {
		[game.ball.x, game.ball.y] = getPosition(game, leftPad, newX, newY);
		return true;
	}
	return false;
}

export function rightPadCollision(game: Game, rightPad: coordinates, newX: number, newY: number): boolean {
	const ball: coordinates = {
		x: newX - (rightPad.x + game.padSpec.halfWidth), 
		y: newY - (rightPad.y + game.padSpec.halfHeight)};
	const paddle: coordinates = {
		x: game.padSpec.halfWidth, 
		y: game.padSpec.halfHeight
	};
	if (distBallPad(ball, paddle) <= game.ball.radius) {
		[game.ball.x, game.ball.y] = getPosition(game, rightPad, newX, newY);
		return true
	}
	return false;
}

function distBallPad(p: coordinates, b: coordinates): number {
    const d: coordinates = {x: Math.abs(p.x) - b.x, y: Math.abs(p.y) - b.y};
	d.x = Math.max(d.x, 0.0);
	d.y = Math.max(d.y, 0.0);
	const length: number = Math.sqrt(d.x * d.x + d.y * d.y);
    return length + Math.min(Math.max(d.x, d.y), 0.0);
}

function getPosition(game: Game, paddle: coordinates, newX: number, newY: number): [number, number] {
	// console.log("IN GETPOSITION")
	const side: string = getCollisionSide(game, paddle);
	const offset: number = game.ball.radius + 1;
	const incPaddle: coordinates = {x: paddle.x - game.ball.radius, y: paddle.y - game.ball.radius};
	const padHeight: number = game.padSpec.height + 2 * game.ball.radius;
	const padWidth: number = game.padSpec.width + 2 * game.ball.radius;

	switch (side) {
		case "left":
			[newX, newY] = lineIntersection({x: game.ball.x, y: game.ball.y}, {x: newX, y: newY}, incPaddle, {x: incPaddle.x, y: incPaddle.y + padHeight});
			[game.ball.dx, game.ball.dy] = incVelocity(-Math.abs(game.ball.dx), game.ball.dy);
			return [newX, newY];
		case "right":
			[newX, newY] = lineIntersection({x: game.ball.x, y: game.ball.y}, {x: newX, y: newY}, {x: incPaddle.x + padWidth, y: incPaddle.y}, {x: incPaddle.x + padWidth, y: incPaddle.y + padHeight});
			[game.ball.dx, game.ball.dy] = incVelocity(Math.abs(game.ball.dx), game.ball.dy);
			return [newX, newY];
		case "top":
			[newX, newY] = lineIntersection({x: game.ball.x, y: game.ball.y}, {x: newX, y: newY}, incPaddle, {x: incPaddle.x + padWidth, y: incPaddle.y});
			[game.ball.dx, game.ball.dy] = incVelocity(game.ball.dx, -Math.abs(game.ball.dy));
			return [newX, newY];
		case "bottom":
			[newX, newY] = lineIntersection({x: game.ball.x, y: game.ball.y}, {x: newX, y: newY}, {x: incPaddle.x, y: incPaddle.y + padHeight}, {x: incPaddle.x + padWidth, y: incPaddle.y + padHeight});
			[game.ball.dx, game.ball.dy] = incVelocity(game.ball.dx, Math.abs(game.ball.dy));
			return [newX, newY];
		case "topleft":
			[game.ball.dx, game.ball.dy] = incVelocity(game.ball.dx * -1, game.ball.dy * -1);
			return [paddle.x - offset, paddle.y - offset];
		case "topright":
			[game.ball.dx, game.ball.dy] = incVelocity(game.ball.dx * -1, game.ball.dy * -1);
			return [paddle.x + game.padSpec.width + offset, paddle.y - offset];
		case "bottomleft":
			[game.ball.dx, game.ball.dy] = incVelocity(game.ball.dx * -1, game.ball.dy * -1);
			return [paddle.x - offset, paddle.y + game.padSpec.height + offset];
		case "bottomright":
			[game.ball.dx, game.ball.dy] = incVelocity(game.ball.dx * -1, game.ball.dy * -1);
			return [paddle.x + game.padSpec.width + offset, paddle.y + game.padSpec.height + offset];
		default:
			return [newX, newY];
	}
}

function lineIntersection(p1: coordinates, p2: coordinates, p3: coordinates, p4: coordinates): [number, number] {
	const denom: number = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
	const t: number = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
	// const u: number = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;
	const newX: number = p1.x + t * (p2.x - p1.x);
	const newY: number = p1.y + t * (p2.y - p1.y);
	return [newX, newY];
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

function incVelocity(dx: number, dy: number): [number, number] {
	if (dx <= 0.5 && dx >= -0.5)
		dx *= 1.2;
	if (dy <= 0.5 && dy >= -0.5)
		dy *= 1.2;
	return [dx, dy];
}
