import { wsRequest } from './wsreply.js'

const WIDTH = 480;
const HEIGHT = 270;

wsRequest();

const game = document.getElementById("game") as HTMLElement;
game.className = "min-h-screen flex flex-col items-center justify-center bg-white"
// "border-[5px] border-[#f7d793] bg-[antiquewhite]";

const h1 = document.querySelector('h1') as HTMLElement;
h1.className = "text-4xl font-bold mb-6";
// "m-2.5 p-2.5 bg-beige";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.className = "border mb-6 bg-aliceblue border-4 border-[#8ec7fc] rounded-[20px]";

canvas.width = WIDTH;
canvas.height = HEIGHT;

const ctx = canvas.getContext('2d');

if (ctx === null) {
    console.log("error: context not supported");
    process.exit(1);
}

function drawPaddle(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillRect(10 + x, 108 + y, 10, 54);
    ctx.fillRect(460 + x, 108 + y, 10, 54);
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

function keyEventHandler(event: KeyboardEvent): void {
    // if (event.key === "ArrowUp")
    //     ;        
    // if (event.key === "ArrowDown")
    //     ;
}

interface paddelPos {
    x: number;
    y: number;
}

function renderGame(ctx: CanvasRenderingContext2D) {
    // let leftPad :paddelPos = {10 108};
    drawMiddleLine(ctx);
    drawPaddle(ctx, 0 , 0);
    drawBall(ctx);
}

renderGame(ctx);

window.addEventListener("keydown", keyEventHandler);

// window.addEventListener("load", );