import { wsRequest } from './wsreply.js'

wsRequest();

// const body = document.body as HTMLElement;
// body.className = "min-h-screen font-sans text-[#f1a541] bg-lavender flex flex-col justify-center items-center content-center gap-[50px]";

const game = document.getElementById("game") as HTMLElement;
game.className = "min-h-screen flex flex-col items-center justify-center bg-white"
// "border-[5px] border-[#f7d793] bg-[antiquewhite] flex flex-col items-center";

const h1 = document.querySelector('h1') as HTMLElement;
h1.className = "text-4xl font-bold mb-6";
// "m-2.5 p-2.5 bg-beige";

const buttons = document.getElementById("buttons") as HTMLElement;
buttons.className = "flex space-x-4 mb-8";
buttons.innerHTML = `
<button id="btn-up" class="rounded bg-amber-400 px-4 py-2 text-white">UP</button>
<button id="btn-down" class="rounded bg-amber-400 px-4 py-2 text-white">DOWN</button>
<button id="btn-left" class="rounded bg-amber-400 px-4 py-2 text-white">LEFT</button>
<button id="btn-right" class="rounded bg-amber-400 px-4 py-2 text-white">RIGHT</button>
`

const backLink = document.querySelector('a') as HTMLElement;
backLink.className = "mt-4 py-3 px-8 rounded-full border-1 border-black bg-gradient-to-br from-[#ffcc00] to-[#ea9800] shadow-md hover:scale-105 transition-all text-white text-lg font-semibold"

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.className = "border mb-6";
// "bg-aliceblue border-4 border-[#8ec7fc] rounded-[20px] m-12";

canvas.width = 480;
canvas.height = 270;

if (canvas.getContext('2d')) {
    const ctx = canvas.getContext('2d');
}
else {
    console.log("error: context not supported");
    process.exit(1);
}

// window.addEventListener("load", );