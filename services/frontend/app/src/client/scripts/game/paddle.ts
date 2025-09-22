import * as game from './pong.js'

export function createKeyDownEvent(ws: WebSocket) {
	return function keyDownEvent(event: KeyboardEvent): void {
		const ctx: CanvasRenderingContext2D = game.getCanvasContext();
		if (event.key === "ArrowUp" || event.key === "ArrowDown")
			updatePaddlePos(game.rightPad, event.key, ws, ctx);
		if (event.key === "w" || event.key === "s")
			updatePaddlePos(game.leftPad, event.key, ws, ctx);
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
