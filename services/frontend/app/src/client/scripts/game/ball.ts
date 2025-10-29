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
		/*[game.ball.x, game.ball.y] =*/ getPosition(game, leftPad, newX, newY);
		return true;
	}
	return false;
}

function rightPadCollision(game: Game, rightPad: coordinates, newX: number, newY: number): boolean
{
	const p: coordinates = {x: newX - (rightPad.x + 5), y: newY - (rightPad.y + 27)};
	const b: coordinates = {x :(10 / 2), y:(54 / 2)};
	if (sdBox(p, b) <= BALL_RADIUS) {
		/*[game.ball.x, game.ball.y] =*/ getPosition(game, rightPad, newX, newY);
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
	const distToLeft = Math.abs(game.ball.x - paddle.x);
	const distToRight = Math.abs(game.ball.x - (paddle.x + 10));
	const distToTop = Math.abs(game.ball.y - paddle.y);
	const distToBottom = Math.abs(game.ball.y - (paddle.y + 54));

	const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
	let unique: boolean = true;
	if (new Set([distToLeft, distToRight, distToTop, distToBottom]).size !== 4)
		unique = false;
	if (unique && minDist === distToLeft
		&& game.ball.y > paddle.y - BALL_RADIUS
		&& game.ball.y < paddle.y + 54 + BALL_RADIUS) {
		newX = paddle.x - (BALL_RADIUS + 2);
		[game.ball.x, game.ball.y] = [newX, newY];
		game.ball.dx = increaseVelocity(-Math.abs(game.ball.dx));
	}
	else if (unique && minDist === distToRight
		&& game.ball.y > paddle.y - BALL_RADIUS
		&& game.ball.y < paddle.y + 54 + BALL_RADIUS) {
		newX = paddle.x + 10 + (BALL_RADIUS + 2);
		[game.ball.x, game.ball.y] = [newX, newY];
		game.ball.dx = increaseVelocity(Math.abs(game.ball.dx));
	}
	else if (unique && minDist === distToTop
		&& game.ball.x > paddle.x - BALL_RADIUS
		&& game.ball.x < paddle.x + 10 + BALL_RADIUS) {
		newY = paddle.y - (BALL_RADIUS + 2);
		[game.ball.x, game.ball.y] = [newX, newY];
		game.ball.dy = increaseVelocity(-Math.abs(game.ball.dy));
	}
	else if (unique && minDist === distToBottom
		&& game.ball.x > paddle.x - BALL_RADIUS
		&& game.ball.x < paddle.x + 10 + BALL_RADIUS) {
		newY = paddle.y + 54 + (BALL_RADIUS + 2);
		[game.ball.x, game.ball.y] = [newX, newY];
		game.ball.dy = increaseVelocity(Math.abs(game.ball.dy));
	}
	else {
		const isLeft = game.ball.x < paddle.x + 5;
		const isTop = game.ball.y < paddle.y + 27;
		
		if (isLeft && isTop) {
			newX = paddle.x - (BALL_RADIUS + 2);
			newY = paddle.y - (BALL_RADIUS + 2);
			game.ball.dx = increaseVelocity(-Math.abs(game.ball.dx));
			game.ball.dy = increaseVelocity(-Math.abs(game.ball.dy));
		} else if (!isLeft && isTop) {
			newX = paddle.x + 10 + (BALL_RADIUS + 2);
			newY = paddle.y - (BALL_RADIUS + 2);
			game.ball.dx = increaseVelocity(Math.abs(game.ball.dx));
			game.ball.dy = increaseVelocity(-Math.abs(game.ball.dy));
		} else if (isLeft && !isTop) {
			newX = paddle.x - (BALL_RADIUS + 2);
			newY = paddle.y + 54 + (BALL_RADIUS + 2);
			game.ball.dx = increaseVelocity(-Math.abs(game.ball.dx));
			game.ball.dy = increaseVelocity(Math.abs(game.ball.dy));
		} else {
			newX = paddle.x + 10 + (BALL_RADIUS + 2);
			newY = paddle.y + 54 + (BALL_RADIUS + 2);
			game.ball.dx = increaseVelocity(Math.abs(game.ball.dx));
			game.ball.dy = increaseVelocity(Math.abs(game.ball.dy));
		}
	}
	return [newX, newY];
}

function increaseVelocity(velocity: number): number {
	if (velocity <= 0.5 && velocity >= -0.5)
		velocity *= 1.1;
	return velocity
}
