import * as game from './pong.js'

// export function createKeyDownEvent(ws: WebSocket) {
	// return function keyDownEvent(event: KeyboardEvent): void {
	// 	const ctx: CanvasRenderingContext2D = game.getCanvasContext();
	// 	if (event.key === "ArrowUp" || event.key === "ArrowDown")
	// 		updatePaddlePos(game.rightPad, event.key, ws, ctx);
	// 	if (event.key === "w" || event.key === "s")
	// 		updatePaddlePos(game.leftPad, event.key, ws, ctx);
	// }
// }

type paddleMap = Map< string, number >

export function addMessEvent(leftPad: game.paddlePos, rightPad: game.paddlePos, ws: WebSocket) {
	ws.onmessage = (event) => {
		const paddles: paddleMap = JSON.parse(event.data);
		let newPos: number | undefined = paddles.get("leftPad");
		if (newPos)
			leftPad.y = newPos;
		newPos = paddles.get("rightPad");
		if (newPos)
			rightPad.y = newPos;
	};
}

export function createKeyDownEvent(keys: game.keys, ws: WebSocket)  {
	return function keyDownEvent(event: KeyboardEvent): void {
		if (event.key === "w")
			keys.w = true;
		if (event.key === "s")
			keys.s = true;
		if (event.key === "ArrowUp")
			keys.ArrowUp = true;
		if (event.key === "ArroDown")
			keys.ArrowDown = true;
		ws.send(JSON.stringify(keys));
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
		if (event.key === "ArroDown")
			keys.ArrowDown = false;
	}
}

