import { Game, HEIGHT, type ballObj } from "./game.class.js";
import type { coordinates, repObj } from "./mess.validation.js";

const TIME_STEP: number = 1000 / 60; // 60FPS
const BALL_RADIUS: number = 10;

export function deadReckoning(game: Game, latestReply: repObj | undefined) {
	console.log("IN DEADRECKONING");
	let timeSinceUpdate: number = performance.now() - game.lastFrameTime; //TIME_STEP;
	let ball: ballObj = { ...game.ball };
	if (latestReply !== undefined) {
		timeSinceUpdate = (performance.now() - latestReply._timestamp)
		ball = latestReply._ball;
	}
	if (timeSinceUpdate > 100) //TODO: add var for 100
		timeSinceUpdate = 100
	let newX: number = ball.x + ball.dx * timeSinceUpdate;
	let newY: number = ball.y + ball.dy * timeSinceUpdate;
	updateBallPos(game, newX, newY);
}

function updateBallPos(game: Game, newX: number, newY: number) {
	newY = upperWallCollision(game, newY);
	newY = bottomWallCollision(game, newY);
	if (leftPadCollision(game, game.leftPad, newX, newY))
		return false;
	if (rightPadCollision(game, game.rightPad, newX, newY))
		return false;
	// [newX, newY] = leftPadCollision(game, game.leftPad, newX, newY);
	// [newX, newY] = rightPadCollision(game, game.rightPad, newX, newY);

	game.ball.x = newX;
	game.ball.y = newY;
}

function upperWallCollision(game: Game, newY: number): number {
	if (newY - BALL_RADIUS <= 0) {
		newY = BALL_RADIUS;
		game.ball.dy = increaseVelocity(Math.abs(game.ball.dy));
	}
	return newY;
}

function bottomWallCollision(game: Game, newY: number): number {
	if (newY + BALL_RADIUS >= HEIGHT) {
		newY = HEIGHT - BALL_RADIUS;
		game.ball.dy = increaseVelocity(-Math.abs(game.ball.dy));
	}
	return newY;
}

function leftPadCollision(game: Game, leftPad: coordinates, newX: number, newY: number): boolean
{
	const p: coordinates = {x: newX - (leftPad.x + 5), y: newY - (leftPad.y + 27)};
	const b: coordinates = {x :(10 / 2), y:(54 / 2)};
	if (sdBox(p, b) <= BALL_RADIUS) {
		/*[game.ball.x, game.ball.y] = */getPosition(game, leftPad, newX, newY);
		return true;
	}
	return false;
}

function rightPadCollision(game: Game, rightPad: coordinates, newX: number, newY: number): boolean
{
	const p: coordinates = {x: newX - (rightPad.x + 5), y: newY - (rightPad.y + 27)};
	const b: coordinates = {x :(10 / 2), y:(54 / 2)};
	if (sdBox(p, b) <= BALL_RADIUS) {
		/*[game.ball.x, game.ball.y] = */getPosition(game, rightPad, newX, newY);
		return true
	}
	return false;
}

function sdBox(p: coordinates, b: coordinates): number {
    const d: coordinates = {x: Math.abs(p.x) - b.x, y: Math.abs(p.y) - b.y};
	d.x = Math.max(d.x, 0.0);
	d.y = Math.max(d.y, 0.0);
	const length: number = Math.sqrt(d.x * d.x + d.y * d.y);
    return length + Math.min(Math.max(d.x, d.y), 0.0);
}

function getPosition(game: Game, paddle: coordinates, newX: number, newY: number): [number, number] {
	const side: string = getCollisionSide(game, paddle);
	switch (side) {
		case "left":
			newX = paddle.x - (BALL_RADIUS + 2);
			[game.ball.x, game.ball.y] = [newX, newY];
			game.ball.dx = increaseVelocity(-Math.abs(game.ball.dx));
			break;
		case "right":
			newX = paddle.x + 10 + (BALL_RADIUS + 2);
			[game.ball.x, game.ball.y] = [newX, newY];
			game.ball.dx = increaseVelocity(Math.abs(game.ball.dx));
			break;
		case "top":
			newY = paddle.y - (BALL_RADIUS + 2);
			[game.ball.x, game.ball.y] = [newX, newY];
			game.ball.dy = increaseVelocity(-Math.abs(game.ball.dy));
			break;
		case "bottom":
			newY = paddle.y + 54 + (BALL_RADIUS + 2);
			[game.ball.x, game.ball.y] = [newX, newY];
			game.ball.dy = increaseVelocity(Math.abs(game.ball.dy));
			break;
		case "topleft":
			newX = paddle.x - (BALL_RADIUS + 2);
			newY = paddle.y - (BALL_RADIUS + 2);
			[game.ball.x, game.ball.y] = [newX, newY];
			game.ball.dx = increaseVelocity(-Math.abs(game.ball.dx));
			game.ball.dy = increaseVelocity(-Math.abs(game.ball.dy));
			break;
		case "topright":
			newX = paddle.x + 10 + (BALL_RADIUS + 2);
			newY = paddle.y - (BALL_RADIUS + 2);
			[game.ball.x, game.ball.y] = [newX, newY];
			game.ball.dx = increaseVelocity(Math.abs(game.ball.dx));
			game.ball.dy = increaseVelocity(-Math.abs(game.ball.dy));
			break;
		case "bottomleft":
			newX = paddle.x - (BALL_RADIUS + 2);
			newY = paddle.y + 54 + (BALL_RADIUS + 2);
			[game.ball.x, game.ball.y] = [newX, newY];
			game.ball.dx = increaseVelocity(-Math.abs(game.ball.dx));
			game.ball.dy = increaseVelocity(Math.abs(game.ball.dy));
			break;
		case "bottomright":
			newX = paddle.x + 10 + (BALL_RADIUS + 2);
			newY = paddle.y + 54 + (BALL_RADIUS + 2);
			[game.ball.x, game.ball.y] = [newX, newY];
			game.ball.dx = increaseVelocity(Math.abs(game.ball.dx));
			game.ball.dy = increaseVelocity(Math.abs(game.ball.dy));
			break;
		default:
			return [newX, newY];
	}
	return [newX, newY];
}

function getCollisionSide(game: Game, paddle: coordinates): "left" | "right" | "top" | "bottom" | "topleft" | "topright" | "bottomleft" | "bottomright" {
    const paddleCenterX = paddle.x + 5;
    const paddleCenterY = paddle.y + 27;

    const dx = game.ball.x - paddleCenterX;
    const dy = game.ball.y - paddleCenterY;

    const normalizedX = dx / 5;
    const normalizedY = dy / 27;
    
    const absX = Math.abs(normalizedX);
    const absY = Math.abs(normalizedY);
    
    const cornerThreshold = 0.1;

    if (Math.abs(absX - absY) < cornerThreshold) {
        if (dx > 0 && dy < 0) return "topright";
        if (dx > 0 && dy > 0) return "bottomright";
        if (dx < 0 && dy < 0) return "topleft";
        return "bottomleft";
    }
    if (absX > absY) {
        return dx > 0 ? "right" : "left";
    } else {
        return dy > 0 ? "bottom" : "top";
    }
}

function increaseVelocity(velocity: number): number {
	if (velocity <= 0.5 && velocity >= -0.5)
		velocity *= 1.1;
	return velocity
}
