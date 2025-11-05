import { Game, HEIGHT, WIDTH, type ballObj } from "./game.class.js";
import type { coordinates, repObj } from "./mess.validation.js";

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
	if (newX - game.ball.radius >= WIDTH + 50 || newX + game.ball.radius <= -50) {
		game.ball.x = WIDTH / 2;
		game.ball.y = HEIGHT / 2;
		game.ball.dx = 0;
		game.ball.dy = 0;
		return true;
	}
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

function leftPadCollision(game: Game, leftPad: coordinates, newX: number, newY: number): boolean {
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

function rightPadCollision(game: Game, rightPad: coordinates, newX: number, newY: number): boolean {
	const ball: coordinates = {
		x: newX - (rightPad.x + game.padSpec.halfWidth), 
		y: newY - (rightPad.y + game.padSpec.halfHeight)
	};
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
	const side: string = getCollisionSide(game, paddle);
	const offset: number = game.ball.radius + 1;

	switch (side) {
		case "left":
			[game.ball.dx, game.ball.dy] = incVelocity(-Math.abs(game.ball.dx), game.ball.dy);
			return [paddle.x - offset, newY];
		case "right":
			[game.ball.dx, game.ball.dy] = incVelocity(Math.abs(game.ball.dx), game.ball.dy);
			return [paddle.x + game.padSpec.width + offset, newY];
		case "top":
			[game.ball.dx, game.ball.dy] = incVelocity(game.ball.dx, -Math.abs(game.ball.dy));
			return [newX, paddle.y - offset];
		case "bottom":
			[game.ball.dx, game.ball.dy] = incVelocity(game.ball.dx, Math.abs(game.ball.dy));
			return [newX, paddle.y + game.padSpec.height + offset];
		case "topleft":
			[game.ball.dx, game.ball.dy] = incVelocity(-Math.abs(game.ball.dx), -Math.abs(game.ball.dy));
			return [paddle.x - offset, paddle.y - offset];
		case "topright":
			[game.ball.dx, game.ball.dy] = incVelocity(Math.abs(game.ball.dx), -Math.abs(game.ball.dy));
			return [paddle.x + game.padSpec.width + offset, paddle.y - offset];
		case "bottomleft":
			[game.ball.dx, game.ball.dy] = incVelocity(-Math.abs(game.ball.dx), Math.abs(game.ball.dy));
			return [paddle.x - offset, paddle.y + game.padSpec.height + offset];
		case "bottomright":
			[game.ball.dx, game.ball.dy] = incVelocity(Math.abs(game.ball.dx), Math.abs(game.ball.dy));
			return [paddle.x + game.padSpec.width + offset, paddle.y + game.padSpec.height + offset];
		default:
			return [newX, newY];
	}
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
    // if (absX > absY) {
	// 	if (dx > 0 && game.ball.dx < 0)
	// 		return "right";
	// 	if (dx < 0 && game.ball.dx > 0)
	// 		return "left";
	// }
    // else {
	// 	if (dy > 0 && game.ball.dy < 0)
	// 		return "bottom";
	// 	if (dy < 0 && game.ball.dy > 0)
	// 		return "top";
	// }
	// return "null";
}

function incVelocity(dx: number, dy: number): [number, number] {
	if (dx <= 0.5 && dx >= -0.5)
		dx *= 1.2;
	if (dy <= 0.5 && dy >= -0.5)
		dy *= 1.2;
	return [dx, dy];
}
