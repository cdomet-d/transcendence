const WIDTH = 480;
const HEIGHT = 270;

interface paddelPos {
	x: number;
	y: number;
}

let leftPad: paddelPos = {x: 10, y: 108};
let rightPad: paddelPos = {x: 460, y: 108};

function pong(ws: WebSocket, main: HTMLElement) {
	main.innerHTML = `
	<div id="game">
      <h1>Game Screen</h1>
      <canvas id="canvas">
        pong game <!-- fallback if unable to be displayed -->
      </canvas>
	  <a href="/central" data-link id="back-btn" >
		Back
	  </a>
    </div>
	`;
	const canvas = document.getElementById("canvas") as HTMLCanvasElement;
	styleGame(canvas);

	const ctx = canvas.getContext('2d');
	if (ctx === null) {
		console.log("error: context not supported");
		process.exit(1);
	}

	renderGame(ctx);
	window.addEventListener("keydown", createKeyDownEvent(ctx,ws));
}

function styleGame(canvas: HTMLCanvasElement) {
	const game = document.getElementById("game") as HTMLElement;
	game.className = "min-h-screen flex flex-col items-center justify-center bg-white"
	// "border-[5px] border-[#f7d793] bg-[antiquewhite]";

	const h1 = document.querySelector('h1') as HTMLElement;
	h1.className = "text-4xl font-bold mb-6";
	// "m-2.5 p-2.5 bg-beige";

	const backBtn = document.getElementById("back-btn") as HTMLElement;
	backBtn.className = "mt-4 py-3 px-8 rounded-full border-1 border-black bg-gradient-to-br from-[#ffcc00] to-[#ea9800] shadow-md hover:scale-105 transition-all text-white text-lg font-semibold";

	canvas.className = "border mb-6 bg-aliceblue border-4 border-[#8ec7fc] rounded-[20px]";
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
}

function renderGame(ctx: CanvasRenderingContext2D) {
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

function createKeyDownEvent(ctx: CanvasRenderingContext2D, ws: WebSocket) {
	return function keyDownEvent(event: KeyboardEvent): void {
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