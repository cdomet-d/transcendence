import * as game from './pong.js'

// type messMap = Map< string, number >

interface messObj {
	leftPad: number | undefined,
	rightPad: number | undefined,
}

export function addMessEvent(leftPad: game.paddlePos, rightPad: game.paddlePos, ws: WebSocket) {
	ws.onmessage = (event) => {
		const mess: messObj = JSON.parse(event.data);
		let newPos: number | undefined = mess.leftPad;
		if (newPos)
			leftPad.y = newPos;
		newPos = mess.rightPad;
		if (newPos)
			rightPad.y = newPos;
	};
}

export function createKeyDownEvent(keys: game.keys)  {
	return function keyDownEvent(event: KeyboardEvent): void {
		if (event.key === "w")
			keys.w = true;
		if (event.key === "s")
			keys.s = true;
		if (event.key === "ArrowUp")
			keys.ArrowUp = true;
		if (event.key === "ArrowDown")
			keys.ArrowDown = true;
	}
}

export function createKeyUpEvent(keys: game.keys)  {
	return function keyUpEvent(event: KeyboardEvent): void {
		if (event.key === "w")
			keys.w = false;
		if (event.key === "s")
			keys.s = false;
		if (event.key === "ArrowUp")
			keys.ArrowUp = false;
		if (event.key === "ArrowDown")
			keys.ArrowDown = false;
	}
}

