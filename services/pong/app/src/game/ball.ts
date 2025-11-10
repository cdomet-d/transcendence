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

export function leftPadCollision(game: Game, leftPad: coordinates, newX: number, newY: number): boolean {
	return getPosition(game, leftPad, newX, newY);
}

export function rightPadCollision(game: Game, rightPad: coordinates, newX: number, newY: number): boolean {
	return getPosition(game, rightPad, newX, newY);
}

function getPosition(game: Game, paddle: coordinates, newX: number, newY: number): boolean {
	const offset: number = game.ball.radius + 1;
	const p1: coordinates = {x: game.ball.x, y: game.ball.y};
	const p2: coordinates = {x: newX, y: newY};
	const incPaddle: coordinates = {x: paddle.x - game.ball.radius, y: paddle.y - game.ball.radius};
	const padHeight: number = game.padSpec.height + 2 * game.ball.radius;
	const padWidth: number = game.padSpec.width + 2 * game.ball.radius;
	const side: string = getCollisionSide(game, paddle);
	let newPos: coordinates | null;
	const topright: coordinates = {x: paddle.x + game.padSpec.width + offset, y: paddle.y - offset};
	const topleft: coordinates = {x: paddle.x - offset, y: paddle.y - offset};
	const bottomright: coordinates = {x: paddle.x + game.padSpec.width + offset, y: paddle.y + game.padSpec.height + offset};
	const bottomleft: coordinates = {x: paddle.x - offset, y: paddle.y + game.padSpec.height + offset};
	let yOffset: number = 1;
	if (game.ball.dy > 0)
		yOffset *= -1;
	let xOffset: number = 1;
	if (game.ball.dx > 0)
		xOffset *= -1;
	switch (side) {
		case "left":
			newPos = lineIntersection(p1, p2, incPaddle, {x: incPaddle.x, y: incPaddle.y + padHeight});
			if (!newPos) return false;
			[game.ball.dx, game.ball.dy] = updateVelocity(game.ball.dx, game.ball.dy, -1, 0);
			[game.ball.x, game.ball.y] = [newPos.x - 1, newPos.y + yOffset];
			return true;
		case "right":
			newPos = lineIntersection(p1, p2, {x: incPaddle.x + padWidth, y: incPaddle.y}, {x: incPaddle.x + padWidth, y: incPaddle.y + padHeight});
			if (!newPos) return false;
			[game.ball.dx, game.ball.dy] = updateVelocity(game.ball.dx, game.ball.dy, 1, 0);
			[game.ball.x, game.ball.y] = [newPos.x + 1, newPos.y + 1];
			return true;
		case "top":
			newPos = lineIntersection(p1, p2, incPaddle, {x: incPaddle.x + padWidth, y: incPaddle.y});
			if (!newPos) return false;
			[game.ball.dx, game.ball.dy] = updateVelocity(game.ball.dx, game.ball.dy, 0, -1);
			[game.ball.x, game.ball.y] = [newPos.x + xOffset, newPos.y - 1];
			return true;
		case "bottom":
			newPos = lineIntersection(p1, p2, {x: incPaddle.x, y: incPaddle.y + padHeight}, {x: incPaddle.x + padWidth, y: incPaddle.y + padHeight});
			if (!newPos) return false;
			[game.ball.dx, game.ball.dy] = updateVelocity(game.ball.dx, game.ball.dy, 0, 1);
			[game.ball.x, game.ball.y] = [newPos.x + xOffset, newPos.y - 1];
			return true;
		case "topright":
			if (corner(game, paddle, newX, newY, topright)) {
				[game.ball.x, game.ball.y] = [topright.x, topright.y];
				return true;
			}
			return false;
		case "topleft":
			if (corner(game, paddle, newX, newY, topleft)) {
				[game.ball.x, game.ball.y] = [topleft.x, topleft.y];
				return true;
			}
			return false;
		case "bottomright":
			if (corner(game, paddle, newX, newY, bottomright)) {
				[game.ball.x, game.ball.y] = [bottomright.x, bottomleft.y];
				return true;
			}
			return false;
		case "bottomleft":
			if (corner(game, paddle, newX, newY, bottomleft)) {
				[game.ball.x, game.ball.y] = [bottomleft.x, bottomleft.y];
				return true;
			}
			return false;
		default:
			return false;
	}
}

function normal(game: Game, border: coordinates): [number, number] {
	let nx: number = game.ball.x - border.x;
	let ny: number = game.ball.y - border.y;
	const len: number = Math.hypot(nx, ny);
	nx /= len;
	ny /= len;
	return [nx, ny];
}

function corner(game: Game, paddle: coordinates, newX: number, newY: number, corner: coordinates): boolean {
	const ball: coordinates = {
		x: newX - (paddle.x + game.padSpec.halfWidth), 
		y: newY - (paddle.y + game.padSpec.halfHeight)};
	const paddleCadrant: coordinates = {
		x: game.padSpec.halfWidth, 
		y: game.padSpec.halfHeight
	};
	if (distBallPad(ball, paddleCadrant) <= game.ball.radius) {
		const [nx, ny]: [number, number] = normal(game, corner);
		[game.ball.dx, game.ball.dy] = updateVelocity(game.ball.dx, game.ball.dy, nx, ny);
		return true;
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

function lineIntersection(p1: coordinates, p2: coordinates, p3: coordinates, p4: coordinates): coordinates | null {
	const denom: number = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
	if (denom === 0) return null;
	const t: number = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
	if ( t > 1 || t < 0) return null;
	const u: number = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;
	if (u > 1 || u < 0) return null;
	const newX: number = p1.x + t * (p2.x - p1.x);
	const newY: number = p1.y + t * (p2.y - p1.y);
	return {x: newX, y: newY};
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

function updateVelocity(dx: number, dy: number, nx: number, ny: number): [number, number] {
    const dot = dx * nx + dy * ny;
	dx = dx - 2 * dot * nx;
	dy = dy - 2 * dot * ny;
	if (dx <= 0.5 && dx >= -0.5)
		dx *= 1.2;
	if (dy <= 0.5 && dy >= -0.5)
		dy *= 1.2;
	return [dx, dy];
}
