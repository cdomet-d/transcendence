import { Game } from './classes/game-class.js';
import { type coordinates } from './classes/game-interfaces.js';

export function raycast(
    game: Game,
    paddle: coordinates,
    nextX: number,
    nextY: number,
): [number, coordinates] | null {
    const inflatedPad: coordinates = { x: paddle.x - game.ball.r, y: paddle.y - game.ball.r };
    const padHeight: number = game.padSpec.h + 2 * game.ball.r;
    const padWidth: number = game.padSpec.w + 2 * game.ball.r;
    const leftX: number = inflatedPad.x;
    const rightX: number = inflatedPad.x + padWidth;
    const topY: number = inflatedPad.y;
    const bottomY: number = inflatedPad.y + padHeight;

    const p1: coordinates = { x: game.ball.x, y: game.ball.y };
    const p2: coordinates = { x: nextX, y: nextY };
    const padSides = [
        { p3: inflatedPad, p4: { x: leftX, y: bottomY }, n: { x: -1, y: 0 } }, //left
        { p3: { x: rightX, y: topY }, p4: { x: rightX, y: bottomY }, n: { x: 1, y: 0 } }, //right
        { p3: inflatedPad, p4: { x: rightX, y: topY }, n: { x: 0, y: -1 } }, //top
        { p3: { x: leftX, y: bottomY }, p4: { x: rightX, y: bottomY }, n: { x: 0, y: 1 } }, //bottom
    ];

    let smallestT: number = 2;
    let hitN: coordinates | null = null;
    for (const side of padSides) {
        const t: number | null = lineIntersection(p1, p2, side.p3, side.p4);
        if (t !== null && t < smallestT) {
            smallestT = t;
            hitN = side.n;
        }
    }
    if (smallestT < 2 && hitN) return [smallestT, hitN];
    return null;
}

export function lineIntersection(
    p1: coordinates,
    p2: coordinates,
    p3: coordinates,
    p4: coordinates,
): number | null {
    const denom: number = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
    if (denom === 0) return null;
    const t: number = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
    if (t > 1 || t < 0) return null;
    const u: number = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;
    if (u > 1 || u < 0) return null;
    return t;
}

const maxAngleDeg: number = 40;
const maxAngle: number = (maxAngleDeg * Math.PI) / 180;
export function updateVelocity(game: Game, paddle: coordinates, nx: number) {
    let pos: number = 0;
    let normalizedPos: number = 0;
    let speed = Math.hypot(game.ball.dx, game.ball.dy);
    pos = game.ball.y - (paddle.y + game.padSpec.halfH);
    normalizedPos = pos / game.padSpec.halfH;
    normalizedPos = Math.max(-1, Math.min(1, normalizedPos));
    const angle: number = normalizedPos * maxAngle;
    if (nx < 0) game.ball.dx = -speed * Math.cos(angle);
    else game.ball.dx = speed * Math.cos(angle);
    game.ball.dy = speed * Math.sin(angle);

    const boostedSpeed = Math.min(speed * 1.1, game.ball.maxSpeed);
	if (speed !== 0) {
		const factor: number = boostedSpeed / speed;
		game.ball.dx *= factor;
		game.ball.dy *= factor;
	}
}

