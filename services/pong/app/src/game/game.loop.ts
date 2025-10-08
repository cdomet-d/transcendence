import type { Game } from "../classes/game.class";
import { updateBallPos } from './ball.js';
import { updatePaddlePos } from './paddle.js';
import type { ballObj } from '../classes/game.class.js';

const TICK_RATE:number = 1000 / 60;

export function gameLoop(game: Game) {
    //updatePaddles;
    //updateBall;
    //send message to players
    const timeout: number = 1000 / 60;
    setTimeout(gameLoop, timeout, game);
}

/*
let lastFrameTime: number = 0;

const delta: number = mess._timeStamp - lastFrameTime;
lastFrameTime = mess._timeStamp;
sendReply(player, opponent, ball, keys, delta);
*/

/*
function local(player: Player, opponent: Player, ball: ballObj, keys: keysObj, delta: number) {
    updatePaddlePos(player, keys, delta);
    updatePaddlePos(opponent, keys, delta);
    if (updateBallPos(ball, player, opponent, delta)) {
        player.socket.close();
        //TODO: send result to gameManager via nats
        return;
    }
    player.setMessPad("left", player.paddle.y);
    player.setMessPad("right", opponent.paddle.y);
    player.setMessBall("left", ball);
    if (player.socket.readyState === 1)
        player.socket.send(JSON.stringify(player.rep));
    //TODO: handle case where socket isn't open
}
*/

/*
function remote(player: Player, opponent: Player, ball: ballObj, keys: keysObj, delta: number) {
    updatePaddlePos(player, keys, delta);
    player.setMessPad("left", player.paddle.y);
    opponent.setMessPad("right", player.paddle.y);
    
    if (player.ballMaster) { //TODO: change ballMaster if player gets disconnected
        if (updateBallPos(ball, player, opponent, delta)) {
            player.socket.close();
            opponent.socket.close();
            //TODO: send result to gameManager via nats
            return;
        }
        player.setMessBall("left", ball);
        opponent.setMessBall("right", ball);
    }
    
    if (opponent.socket.readyState === 1)
        opponent.socket.send(JSON.stringify(opponent.rep));
    if (player.socket.readyState === 1)
        player.socket.send(JSON.stringify(player.rep));
}

*/