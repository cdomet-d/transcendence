import * as game from './pong.js'

// type messMap = Map< string, number >

interface repObj {
	leftPad: number | undefined,
	rightPad: number | undefined,
}

export function addMessEvent(leftPad: game.paddlePos, rightPad: game.paddlePos, ws: WebSocket) {
	ws.onmessage = (event) => {
		const mess: repObj = JSON.parse(event.data);
		let newPos: number | undefined = mess.leftPad;
		if (newPos)
			leftPad.y = newPos;
		newPos = mess.rightPad;
		if (newPos)
			rightPad.y = newPos;
	};
}

// import { keyChange } from './pong.js';
export function createKeyDownEvent(keys: game.keysObj)  {
	return function keyDownEvent(event: KeyboardEvent): void {
		if (event.key === "w")
			keys._w = true;
		if (event.key === "s")
			keys._s = true;
		if (event.key === "ArrowUp")
			keys._ArrowUp = true;
		if (event.key === "ArrowDown")
			keys._ArrowDown = true;
	}
}

export function createKeyUpEvent(keys: game.keysObj)  {
	return function keyUpEvent(event: KeyboardEvent): void {
		if (event.key === "w")
			keys._w = false;
		if (event.key === "s")
			keys._s = false;
		if (event.key === "ArrowUp")
			keys._ArrowUp = false;
		if (event.key === "ArrowDown")
			keys._ArrowDown = false;
	}
}
