import { Game } from "./game.class.js";
import { type coordinates } from "./mess.validation.js";

export function cornerIntersection(game: Game, paddle: coordinates, newX: number, newY: number, corner: coordinates): boolean {
    const ball: coordinates = {
        x: newX - (paddle.x + game.padSpec.halfWidth), 
        y: newY - (paddle.y + game.padSpec.halfHeight)
    };
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

function normal(game: Game, point: coordinates): [number, number] {
    let nx: number = game.ball.x - point.x;
    let ny: number = game.ball.y - point.y;
    const len: number = Math.hypot(nx, ny);
    nx /= len;
    ny /= len;
    return [nx, ny];
}

export function distBallPad(p: coordinates, b: coordinates): number {
    const d: coordinates = {x: Math.abs(p.x) - b.x, y: Math.abs(p.y) - b.y};
    d.x = Math.max(d.x, 0.0);
    d.y = Math.max(d.y, 0.0);
    const length: number = Math.sqrt(d.x * d.x + d.y * d.y);
    return length + Math.min(Math.max(d.x, d.y), 0.0);
}

export function lineIntersection(p1: coordinates, p2: coordinates, p3: coordinates, p4: coordinates): coordinates | null {
	const denom: number = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
	if (denom === 0) return null;
	const t: number = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
	if (t > 1 || t < 0) return null;
	const u: number = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;
	if (u > 1 || u < 0) return null;
	const newX: number = p1.x + t * (p2.x - p1.x);
	const newY: number = p1.y + t * (p2.y - p1.y);
	return {x: newX, y: newY};
}

export function updateVelocity(dx: number, dy: number, nx: number, ny: number): [number, number] {
    const dot = dx * nx + dy * ny;
	dx = dx - 2 * dot * nx;
	dy = dy - 2 * dot * ny;
	if (dx <= 0.5 && dx >= -0.5)
		dx *= 1.2;
	if (dy <= 0.5 && dy >= -0.5)
		dy *= 1.2;
	return [dx, dy];
}
