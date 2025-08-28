import { wsRequest } from './wsreply.js';
const WIDTH = 480;
const HEIGHT = 270;
wsRequest();
// const body = document.body as HTMLElement;
// body.className = "min-h-screen font-sans text-[#f1a541] bg-lavender flex flex-col justify-center items-center content-center gap-[50px]";
const game = document.getElementById("game");
game.className = "min-h-screen flex flex-col items-center justify-center bg-white";
// "border-[5px] border-[#f7d793] bg-[antiquewhite] flex flex-col items-center";
const h1 = document.querySelector('h1');
h1.className = "text-4xl font-bold mb-6";
// "m-2.5 p-2.5 bg-beige";
// const backLink = document.querySelector('a') as HTMLElement;
// backLink.className = "mt-4 py-3 px-8 rounded-full border-1 border-black bg-gradient-to-br from-[#ffcc00] to-[#ea9800] shadow-md hover:scale-105 transition-all text-white text-lg font-semibold"
const canvas = document.getElementById("canvas");
canvas.className = "border mb-6";
// "bg-aliceblue border-4 border-[#8ec7fc] rounded-[20px] m-12";
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext('2d');
if (ctx === null) {
    console.log("error: context not supported");
    process.exit(1);
}
ctx.fillRect(10, 108, 10, 54);
ctx.fillRect(460, 108, 10, 54);
ctx.beginPath();
ctx.moveTo(WIDTH / 2, 0);
ctx.lineTo(WIDTH / 2, HEIGHT);
ctx.stroke();
ctx.beginPath();
ctx.arc(WIDTH / 2, HEIGHT / 2, 10, 0, Math.PI * 2, false);
ctx.fill();
// window.addEventListener("load", );
