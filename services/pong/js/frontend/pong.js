import { wsRequest } from './wsreply.js'

wsRequest();

const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 600;

if (canvas.getContext('2d')) {
    const ctx = canvas.getContext('2d');
}
else {
    console.log("error: context not supported");
    exit(1);
}
