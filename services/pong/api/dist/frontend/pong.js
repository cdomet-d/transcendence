import { wsRequest } from './wsreply.js';
wsRequest();
const body = document.body;
body.className = "min-h-screen font-sans text-[#f1a541] bg-lavender flex flex-col justify-center items-center content-center gap-[50px]";
const game = document.getElementById("game");
game.className = "border-[5px] border-[#f7d793] bg-[antiquewhite] flex flex-col items-center";
const h1 = document.querySelector('h1');
h1.className = "m-2.5 p-2.5 bg-beige";
const canvas = document.getElementById("canvas");
canvas.className = "bg-aliceblue border-4 border-[#8ec7fc] rounded-[20px] m-12";
canvas.width = 600;
canvas.height = 400;
if (canvas.getContext('2d')) {
    const ctx = canvas.getContext('2d');
}
else {
    console.log("error: context not supported");
    process.exit(1);
}
// window.addEventListener("load", );
