import { coordinates } from "./game-interfaces.js";

export function getBallStartingSpeed(ballspeed: string): coordinates /*| null*/ {
    const level: number = Number(ballspeed);
    // if (Number.isNaN(level))
    //     return null;//TODO
    if (level <= 0)
		return {x: 0.3, y: 0.03};
	if (level === 1)
		return {x: 0.36, y: 0.036};
	if (level === 2)
		return {x: 0.42, y: 0.042};
	if (level === 3)
        return {x: 0.48, y: 0.048};
	if (level === 4)
        return {x: 0.54, y: 0.054};
	if (level >= 5)
        return {x: 0.6, y: 0.06};
	return {x: 0.3, y: 0.03};
}

export function getPaddleSpeed(paddlespeed: string): number {
	const level: number = Number(paddlespeed);
	if (level <= 0)
		return 0.42;
	if (level === 1)
		return 0.496;
	if (level === 2)
		return 0.572;
	if (level === 3)
        return 0.648;
	if (level === 4)
        return 0.724;
	if (level >= 5)
        return 0.80;
	return 0.42;
}
