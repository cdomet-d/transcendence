import { wsRequest } from './wsreply.ts'

wsRequest();

const canvas: HTMLElement = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 400;

if (canvas.getContext('2d')) {
    const ctx = canvas.getContext('2d');
}
else {
    console.log("error: context not supported");
    exit(1);
}



// window.addEventListener("load", );