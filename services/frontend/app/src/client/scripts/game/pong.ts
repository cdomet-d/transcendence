const WIDTH = 480;
const HEIGHT = 270;

interface paddelPos {
	x: number;
	y: number;
}

let leftPad: paddelPos = {x: 10, y: 108};
let rightPad: paddelPos = {x: 460, y: 108};

function pong(/*ws: WebSocket*/) {
	const ctx = getCanvasContext();
	renderGame(ctx);
}

function getCanvasContext(): CanvasRenderingContext2D {
	const canvas = document.getElementById("canvas") as HTMLCanvasElement;
	const ctx = canvas.getContext('2d');
	if (ctx === null) {
		console.log("error: context not supported");
		process.exit(1); //TODO: can't exit
	}
	return ctx;
}

export function renderGame(ctx: CanvasRenderingContext2D) {
	drawMiddleLine(ctx);
	drawPaddle(ctx);
	drawBall(ctx);
}

function drawPaddle(ctx: CanvasRenderingContext2D) {
	ctx.fillRect(leftPad.x, leftPad.y, 10, 54);
	ctx.fillRect(rightPad.x, rightPad.y, 10, 54);
}

function drawMiddleLine(ctx: CanvasRenderingContext2D) {
	ctx.beginPath();
	ctx.moveTo(WIDTH / 2, 0);
	ctx.lineTo(WIDTH / 2, HEIGHT);
	ctx.stroke();
}

function drawBall(ctx: CanvasRenderingContext2D) {
	ctx.beginPath();
	ctx.arc(WIDTH / 2, HEIGHT / 2, 10, 0, Math.PI * 2, false);
	ctx.fill();
}

export function createKeyDownEvent(ws: WebSocket) {
	return function keyDownEvent(event: KeyboardEvent): void {
		const ctx: CanvasRenderingContext2D = getCanvasContext();
		if (event.key === "ArrowUp")
			updatePaddlePos(rightPad, "Pad: ArrowUp", ws, ctx);
		if (event.key === "ArrowDown")
			updatePaddlePos(rightPad, "Pad: ArrowDown", ws, ctx);
		if (event.key === "w")
			updatePaddlePos(leftPad, "Pad: w", ws, ctx);
		if (event.key === "s")
		    updatePaddlePos(leftPad, "Pad: s", ws, ctx);
	}
}

function updatePaddlePos(pad: paddelPos, key: string, ws: WebSocket, ctx: CanvasRenderingContext2D) {
	ws.send(key);
	ws.onmessage = (event) => {
		const newPos: number = Number(event.data);
		ctx.clearRect(pad.x, pad.y, 10, 54);
		pad.y = newPos;
		drawPaddle(ctx);
	};
}

// window.addEventListener("keyup", createKeyUpEvent(ctx));

// window.addEventListener("load", );

export { pong };