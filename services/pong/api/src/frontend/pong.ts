import { wsRequest } from './wsreply.js'

wsRequest();

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
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