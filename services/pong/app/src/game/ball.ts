import { HEIGHT, WIDTH } from "../classes/game.class.js";
import type { paddleObj, ballObj } from "../classes/player.class.js";

let dx: number = 0.2;
let dy: number = 0.05;

export function updateBallPos(ball: ballObj, leftPad: paddleObj, rightPad: paddleObj, delta: number) {
    if (ball.x + (dx * delta) > WIDTH || ball.x + (dx * delta) < 0) {
        ball.x = WIDTH / 2;
        ball.y = HEIGHT / 2;
        return;
    }

    let newX: number = ball.x + (dx * delta);
    let newY: number = ball.y + (dy * delta);

    if ((newY + 10) > HEIGHT || (newY - 10) < 0 ) {
        dy *= -1;
        newY = ball.y + (dy * delta);
    }
    if (touchesPad(leftPad, rightPad, newX, newY)) {
        dx *= -1.1; //TODO: reinitialise
        newX = ball.x + (dx * delta);
    }

    ball.x = newX;
    ball.y = newY;
}

function touchesPad(leftPad: paddleObj, rightPad: paddleObj, newX: number, newY: number): boolean {
    if (newX + 10 > rightPad.x && (newY + 10 > rightPad.y && newY - 10 < rightPad.y + 54))
        return true;
    if (newX - 10 < leftPad.x && (newY + 1 > leftPad.y && newY - 1 < leftPad.y + 54))
        return true;
    return false;
}