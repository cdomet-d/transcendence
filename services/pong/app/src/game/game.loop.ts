import type { Game } from "../classes/game.class.js";
import { updateBallPos } from './ball.js';
import { updatePaddlePos } from './paddle.js';
import type { ballObj } from '../classes/game.class.js';
import { coordinates, Player } from "../classes/player.class.js";

const TICK_RATE:number = 1000 / 60;
let lastFrameTime: number = 0;

export function gameLoop(game: Game, player1: Player, player2: Player) {
    const timestamp: number = Date.now();
    const delta: number =  timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    updatePaddlePos(player1, player1.keys, game.paddleSpeed, delta);
    updatePaddlePos(player2, player2.keys, game.paddleSpeed, delta);
    if (updateBallPos(game.ball, player1, player2, delta)) {
        player1.socket.close();
        if (player2.socket.readyState === 1)
            player2.socket.close();
        //TODO: send result to gameManager via nats
        return;
    }
    sendToPlayer1(player1, player2.paddle, game.ball);
    if (!game.local)
        sendToPlayer2(player2, player1.paddle, game.ball);
    // const timeout: number = 1000 / 60;
    setTimeout(gameLoop, TICK_RATE, game, player1, player2);
}

function sendToPlayer1(player: Player, opponentPaddle: coordinates, ball: ballObj) {
    player.setMessPad("left", player.paddle.y);
    player.setMessPad("right", opponentPaddle.y);
    player.setMessBall("left", ball);
    if (player.socket.readyState === 1) {
        player.socket.send(JSON.stringify(player.rep));
    }
}

function sendToPlayer2(player: Player, opponentPaddle: coordinates, ball: ballObj) {
    player.setMessPad("left", player.paddle.y);
    player.setMessPad("right", opponentPaddle.y);
    player.setMessBall("right", ball);
    if (player.socket.readyState === 1)
        player.socket.send(JSON.stringify(player.rep));
}
