import * as game from './pong.js'

export function createKeyDownEvent(ws: WebSocket) {
	return function keyDownEvent(event: KeyboardEvent): void {
		const ctx: CanvasRenderingContext2D = game.getCanvasContext();
		if (event.key === "ArrowUp")
			updatePaddlePos(game.rightPad, "Pad: ArrowUp", ws, ctx);
		if (event.key === "ArrowDown")
			updatePaddlePos(game.rightPad, "Pad: ArrowDown", ws, ctx);
		if (event.key === "w")
			updatePaddlePos(game.leftPad, "Pad: w", ws, ctx);
		if (event.key === "s")
		    updatePaddlePos(game.leftPad, "Pad: s", ws, ctx);
	}
}

function updatePaddlePos(pad: game.paddlePos, key: string, ws: WebSocket, ctx: CanvasRenderingContext2D) {
	ws.send(key);
	ws.onmessage = (event) => {
		const newPos: number = Number(event.data);
		ctx.clearRect(pad.x, pad.y, 10, 54);
		pad.y = newPos;
		game.drawPaddle(ctx);
	};
}
