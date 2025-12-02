import { redirectOnError } from "../../error";
import type { coordinates } from "./game-interfaces";

export function getBallStartingSpeed(ballspeed: string): coordinates /*| null*/ {
	const level: number = Number(ballspeed);
	// if (Number.isNaN(level)) {
	//     redirectOnError('/lobby-menu', 'Invalid settings'); //TODO: redirect on other page ?
	//     return null
	// }
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
