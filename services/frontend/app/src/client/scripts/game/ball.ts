import { Game, HEIGHT, WIDTH, type ballObj } from "./game.class.js";
import type { coordinates, repObj } from "./mess.validation.js";

const BALL_RADIUS: number = 10;

export function deadReckoning(game: Game, latestReply: repObj | undefined) {
	console.log("IN DEADRECKONING");
	let timeSinceUpdate: number = performance.now() - game.lastFrameTime;
	let ball: ballObj = { ...game.ball };
	if (latestReply !== undefined) {
		timeSinceUpdate = (performance.now() - latestReply._timestamp)
		ball = latestReply._ball;
	}
	if (timeSinceUpdate > 100) //TODO: add var for 100
		timeSinceUpdate = 100;
	let newX: number = ball.x + ball.dx * timeSinceUpdate;
	let newY: number = ball.y + ball.dy * timeSinceUpdate;
	updateBallPos(game, newX, newY);
}

function updateBallPos(game: Game, newX: number, newY: number) {
	if (sideWallCollision(game, newX))
		return false;
	newY = upperAndBottomWallCollision(game, newY);
	if (leftPadCollision(game, game.leftPad, newX, newY))
		return false;
	if (rightPadCollision(game, game.rightPad, newX, newY))
		return false;

	game.ball.x = newX;
	game.ball.y = newY;
}

function sideWallCollision(game: Game, newX: number): boolean {
	if (newX - BALL_RADIUS >= WIDTH + 50 || newX + BALL_RADIUS <= -50) {
		game.ball.x = WIDTH / 2;
		game.ball.y = HEIGHT / 2;
		game.ball.dx = 0;
		game.ball.dy = 0;
		return true;
	}
	return false;
}

function upperAndBottomWallCollision(game: Game, newY: number): number {
	if (newY - BALL_RADIUS <= 0) {
		newY = BALL_RADIUS + 1;
		game.ball.dy = incVelocity(game.ball.dx, Math.abs(game.ball.dy))[1];
	}
	if (newY + BALL_RADIUS >= HEIGHT) {
		newY = HEIGHT - (BALL_RADIUS + 1);
		game.ball.dy = incVelocity(game.ball.dx, -Math.abs(game.ball.dy))[1];
	}
	return newY;
}

function leftPadCollision(game: Game, leftPad: coordinates, newX: number, newY: number): boolean {
	const ball: coordinates = {x: newX - (leftPad.x + 5), y: newY - (leftPad.y + 27)};
	const paddle: coordinates = {x: 5, y: 27};
	if (distBallPad(ball, paddle) <= BALL_RADIUS) {
		[game.ball.x, game.ball.y] = getPosition(game, leftPad, newX, newY);
		return true;
	}
	return false;
}

function rightPadCollision(game: Game, rightPad: coordinates, newX: number, newY: number): boolean {
	const ball: coordinates = {x: newX - (rightPad.x + 5), y: newY - (rightPad.y + 27)};
	const paddle: coordinates = {x: 5, y: 27};
	if (distBallPad(ball, paddle) <= BALL_RADIUS) {
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
	const side: string = getCollisionSide(game, paddle);
	const offset: number = BALL_RADIUS + 1;

	switch (side) {
		case "left":
			[game.ball.dx, game.ball.dy] = incVelocity(-Math.abs(game.ball.dx), game.ball.dy);
			return [paddle.x - offset, newY];
		case "right":
			[game.ball.dx, game.ball.dy] = incVelocity(Math.abs(game.ball.dx), game.ball.dy);
			return [paddle.x + 10 + offset, newY];
		case "top":
			[game.ball.dx, game.ball.dy] = incVelocity(game.ball.dx, -Math.abs(game.ball.dy));
			return [newX, paddle.y - offset];
		case "bottom":
			[game.ball.dx, game.ball.dy] = incVelocity(game.ball.dx, Math.abs(game.ball.dy));
			return [newX, paddle.y + 54 + offset];
		case "topleft":
			[game.ball.dx, game.ball.dy] = incVelocity(-Math.abs(game.ball.dx), -Math.abs(game.ball.dy));
			return [paddle.x - offset, paddle.y - offset];
		case "topright":
			[game.ball.dx, game.ball.dy] = incVelocity(Math.abs(game.ball.dx), -Math.abs(game.ball.dy));
			return [paddle.x + 10 + offset, paddle.y - offset];
		case "bottomleft":
			[game.ball.dx, game.ball.dy] = incVelocity(-Math.abs(game.ball.dx), Math.abs(game.ball.dy));
			return [paddle.x - offset, paddle.y + 54 + offset];
		case "bottomright":
			[game.ball.dx, game.ball.dy] = incVelocity(Math.abs(game.ball.dx), Math.abs(game.ball.dy));
			return [paddle.x + 10 + offset, paddle.y + 54 + offset];
		default:
			return [newX, newY];
	}
}

function getCollisionSide(game: Game, paddle: coordinates): string {
    const padCenterX = paddle.x + 5;
    const padCenterY = paddle.y + 27;

    const dx = game.ball.x - padCenterX;
    const dy = game.ball.y - padCenterY;

    const normalizedX = dx / 5;
    const normalizedY = dy / 27;
    
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
