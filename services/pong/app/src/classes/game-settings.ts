import { HEIGHT } from "./game-class.js";
import { coordinates } from "./game-interfaces.js";

export function getBallStartingSpeed(ballspeed: string): coordinates /*| null*/ {
    const level: number = Number(ballspeed);
    // if (Number.isNaN(level))
    //     return null;//TODO
    if (level <= 0)
		return {x: 0.25, y: 0.03};
	if (level === 1)
		return {x: 0.4, y: 0.045};
	if (level >= 2)
        return {x: 0.55, y: 0.06};
	return {x: 0.25, y: 0.03};
}

export function getPaddleSpeed(paddlespeed: string): number {
	const level: number = Number(paddlespeed);
	if (level <= 0)
		return 0.42;
	if (level === 1)
		return 0.55;
	if (level >= 2)
        return 0.68;
	return 0.42;
}

export function getPaddleHeight(paddlesize: string): number {
	const level: number = Number(paddlesize);
	if (level <= 0)
		return HEIGHT / 5;
	if (level === 1)
		return HEIGHT / 4;
	if (level >= 2)
		return HEIGHT / 3;
	return HEIGHT / 5;
}
