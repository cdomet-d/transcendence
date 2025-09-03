const WIDTH = 480;
const HEIGHT = 270;
let leftPad = { x: 10, y: 108 };
let rightPad = { x: 460, y: 108 };
function pong(ws) {
    const canvas = document.getElementById("canvas");
    styleGame(canvas);
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
        console.log("error: context not supported");
        process.exit(1);
    }
    renderGame(ctx);
    window.addEventListener("keydown", createKeyDownEvent(ctx, ws));
}
function styleGame(canvas) {
    const game = document.getElementById("game");
    game.className = "min-h-screen flex flex-col items-center justify-center bg-white";
    // "border-[5px] border-[#f7d793] bg-[antiquewhite]";
    const h1 = document.querySelector('h1');
    h1.className = "text-4xl font-bold mb-6";
    // "m-2.5 p-2.5 bg-beige";
    canvas.className = "border mb-6 bg-aliceblue border-4 border-[#8ec7fc] rounded-[20px]";
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
}
function renderGame(ctx) {
    drawMiddleLine(ctx);
    drawPaddle(ctx);
    drawBall(ctx);
}
function drawPaddle(ctx) {
    ctx.fillRect(leftPad.x, leftPad.y, 10, 54);
    ctx.fillRect(rightPad.x, rightPad.y, 10, 54);
}
function drawMiddleLine(ctx) {
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
}
function drawBall(ctx) {
    ctx.beginPath();
    ctx.arc(WIDTH / 2, HEIGHT / 2, 10, 0, Math.PI * 2, false);
    ctx.fill();
}
function createKeyDownEvent(ctx, ws) {
    return function keyDownEvent(event) {
        if (event.key === "ArrowUp")
            updatePaddlePos(rightPad, "Pad: ArrowUp", ws, ctx);
        if (event.key === "ArrowDown")
            updatePaddlePos(rightPad, "Pad: ArrowDown", ws, ctx);
        if (event.key === "w")
            updatePaddlePos(leftPad, "Pad: w", ws, ctx);
        if (event.key === "s")
            updatePaddlePos(leftPad, "Pad: s", ws, ctx);
    };
}
function updatePaddlePos(pad, key, ws, ctx) {
    ws.send(key);
    ws.onmessage = (event) => {
        const newPos = Number(event.data);
        ctx.clearRect(pad.x, pad.y, 10, 54);
        pad.y = newPos;
        renderGame(ctx);
    };
}
// window.addEventListener("keyup", createKeyUpEvent(ctx));
// window.addEventListener("load", );
export { pong };
