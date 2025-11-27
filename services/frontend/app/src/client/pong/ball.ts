import { Game, HEIGHT, WIDTH } from './classes/game-class.js';
import { raycast, updateVelocity } from './collision-utils.js';
import type { ballObj, coordinates, repObj } from './classes/game-interfaces.js';

const TIME_STEP: number = 1000 / 60; // 60FPS

export function deadReckoning(game: Game, latestReply: repObj | undefined) {
    let timeSinceUpdate: number = performance.now() - game.lastFrameTime;
    let ball: ballObj = { ...game.ball };
    if (latestReply !== undefined) {
        timeSinceUpdate = performance.now() - latestReply.timestamp;
        ball = { ...latestReply.ball };
    }
    if (timeSinceUpdate > 100)
        timeSinceUpdate = 100;
    const nextX: number = ball.x + ball.dx * timeSinceUpdate;
    const nextY: number = ball.y + ball.dy * timeSinceUpdate;
    updateBallPos(game, nextX, nextY);
}

export function updateBallPos(game: Game, nextX: number, nextY: number) {
    if (sideWallCollision(game, nextX)) 
        return false;
    nextY = upperAndBottomWallCollision(game, nextY);
    if (paddleCollision(game, game.leftPad, nextX, nextY))
        return false;
    if (paddleCollision(game, game.rightPad, nextX, nextY))
        return false;
    game.ball.x = nextX;
    game.ball.y = nextY;
}

function sideWallCollision(game: Game, nextX: number): boolean {
    if (nextX - game.ball.r >= WIDTH + 20 || nextX + game.ball.r <= -20) {
        game.ball.x = WIDTH / 2;
        game.ball.y = HEIGHT / 2;
        game.ball.dx = 0;
        game.ball.dy = 0;
        game.delta = 0;
		game.deleteReplies(game.replyHistory.length);
        return true;
    }
    return false;
}

function upperAndBottomWallCollision(game: Game, nextY: number): number {
    if (nextY - game.ball.r <= 0) {
        nextY = game.ball.r + 1;
        game.ball.dy *= -1;
    }
    if (nextY + game.ball.r >= HEIGHT) {
        nextY = HEIGHT - (game.ball.r + 1);
        game.ball.dy *= -1;
    }
    return nextY;
}

export function paddleCollision(
    game: Game,
    paddle: coordinates,
    nextX: number,
    nextY: number,
): boolean {
    const result: [number, coordinates] | null = raycast(game, paddle, nextX, nextY);
    if (!result) return false;
    const [t, n] = result;
    game.ball.x += game.ball.dx * TIME_STEP * t + 1 * n.x;
    game.ball.y += game.ball.dy * TIME_STEP * t + 1 * n.y;
    updateVelocity(game, paddle, n.x);
    const remainingStep: number = 1 - t;
    game.ball.x += game.ball.dx * TIME_STEP * remainingStep;
    game.ball.y += game.ball.dy * TIME_STEP * remainingStep;
    return true;
}
