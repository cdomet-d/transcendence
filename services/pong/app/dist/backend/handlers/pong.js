const WIDTH = 480;
const HEIGHT = 270;
const padSpeed = 7;
let leftPad = { x: 10, y: 108 };
let rightPad = { x: 460, y: 108 };
function paddlePos(socket, message) {
    const key = message.slice(5, message.length);
    if (key === "ArrowUp") {
        up(rightPad, socket);
    }
    if (key === "ArrowDown") {
        down(rightPad, socket);
    }
    if (key === "w") {
        up(leftPad, socket);
    }
    if (key === "s") {
        down(leftPad, socket);
    }
}
function up(pad, socket) {
    if (pad.y - padSpeed > 0)
        pad.y -= padSpeed;
    socket.send(pad.y.toString());
}
function down(pad, socket) {
    if (pad.y + padSpeed < (HEIGHT - 54))
        pad.y += padSpeed;
    socket.send(pad.y.toString());
}
export { paddlePos };
