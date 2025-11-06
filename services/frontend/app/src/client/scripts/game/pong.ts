const WIDTH = 480;
const HEIGHT = 270;

export interface paddelPos {
    x: number;
    y: number;
}

export let leftPad: paddelPos = { x: 10, y: 108 };
export let rightPad: paddelPos = { x: 460, y: 108 };

function pong() {
    const ctx = getCanvasContext();
    renderGame(ctx);
    import('./wsreply.js').then(({ wsRequest }) => {
        wsRequest();
    }); //TODO: can import fail ?
}

export function getCanvasContext(): CanvasRenderingContext2D {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
        console.log('error: context not supported');
        process.exit(1); //TODO: can't exit
    }
    return ctx;
}

function renderGame(ctx: CanvasRenderingContext2D) {
    drawMiddleLine(ctx);
    drawPaddle(ctx);
    drawBall(ctx);
}

export function drawPaddle(ctx: CanvasRenderingContext2D) {
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

// window.addEventListener("keyup", createKeyUpEvent(ctx));

// window.addEventListener("load", );

export { pong };
