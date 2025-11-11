import type { Game } from "../classes/game.class.js";
import type { coordinates } from "../classes/player.class.js";
import { lineIntersection, updateVelocity } from "./ball.utils.js";

export function paddleCollisionBis(game: Game, paddle: coordinates, newX: number, newY: number): boolean {
	
    const inflatedPad: coordinates = {x: paddle.x - game.ball.radius, y: paddle.y - game.ball.radius};
	const padHeight: number = game.padSpec.height + 2 * game.ball.radius;
	const padWidth: number = game.padSpec.width + 2 * game.ball.radius;

    const left: [coordinates, coordinates, coordinates] = [
        inflatedPad,
        {x: inflatedPad.x, y: inflatedPad.y + padHeight},
        {x: -1, y: 0},
    ]
    if (collision(game, newX, newY, left[0], left[1], left[2]))
        return true;
    const right: [coordinates, coordinates, coordinates] = [
        {x: inflatedPad.x + padWidth, y: inflatedPad.y},
        {x: inflatedPad.x + padWidth, y: inflatedPad.y + padHeight},
        {x: 1, y: 0}
    ]
    if (collision(game, newX, newY, right[0], right[1], right[2]))
        return true;
    const top: [coordinates, coordinates, coordinates] = [
        inflatedPad,
        {x: inflatedPad.x + padWidth, y: inflatedPad.y},
        {x: 0, y: -1}
    ]
    if (collision(game, newX, newY, top[0], top[1], top[2]))
        return true;
    const bottom: [coordinates, coordinates, coordinates] = [
        {x: inflatedPad.x, y: inflatedPad.y + padHeight},
        {x: inflatedPad.x + padWidth, y: inflatedPad.y + padHeight},
        {x: 0, y: 1}
    ]
    if (collision(game, newX, newY, bottom[0], bottom[1], bottom[2]))
        return true;
    return false;
}

function collision(game: Game, newX: number, newY: number, p3: coordinates, p4: coordinates, n: coordinates): boolean {
    let newPos: coordinates | null;
    const p1: coordinates = {x: game.ball.x, y: game.ball.y};
	const p2: coordinates = {x: newX, y: newY};

    newPos = lineIntersection(p1, p2, p3, p4);
    if (!newPos) return false;
    [game.ball.dx, game.ball.dy] = updateVelocity(game.ball.dx, game.ball.dy, n.x, n.y);
    [game.ball.x, game.ball.y] = [newPos.x + 1 * n.x, newPos.y + 1 * n.y];
    return true;
}