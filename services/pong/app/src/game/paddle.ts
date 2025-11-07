import type { coordinates, Player } from '../classes/player.class.js';
import type { keysObj } from './mess.validation.js';
import { Game, HEIGHT, WIDTH, type paddleSpec } from '../classes/game.class.js'
import { leftPadCollision, rightPadCollision } from './ball.js';
const TIME_STEP: number = 1000 / 60; // 60FPS

export function updatePaddlePos(player: Player, keys: keysObj, game: Game) {
    if ((player.left && keys._w) || (player.right && keys._ArrowUp)) {
        up(player.paddle, game.padSpec.speed);
    }
    if ((player.left && keys._s) || (player.right && keys._ArrowDown)) {
        down(player.paddle, game.padSpec);
    }
    if ((player.left && keys._a))
        left(player.paddle, game, 0);
    if ((player.left && keys._d))
        right(player.paddle, game, WIDTH / 2 - game.ball.radius - game.padSpec.width);
    if (player.right && keys._ArrowLeft)
        left(player.paddle, game, WIDTH / 2 + game.ball.radius);
    if (player.right && keys._ArrowRight)
        right(player.paddle, game, WIDTH - game.padSpec.width);
    // if (leftPadCollision(game, player.paddle, game.ball.x, game.ball.y))
    //     return;
    // if (rightPadCollision(game, player.paddle, game.ball.x, game.ball.y))
    //     return;
}

function up(pad: coordinates, padSpeed: number) {
    if (pad.y - (padSpeed * TIME_STEP) > 0)
        pad.y -= (padSpeed * TIME_STEP);
    else
        pad.y = 0;
}

function down(pad: coordinates, padSpec: paddleSpec) {
    if (pad.y + (padSpec.speed * TIME_STEP) < (HEIGHT - padSpec.height))
        pad.y += (padSpec.speed * TIME_STEP);
    else
        pad.y = HEIGHT - padSpec.height;
}
//TODO: check if ball is between paddle and wall

function left(pad: coordinates, game: Game, limit: number) {
    if (pad.x  - (game.padSpec.speed * TIME_STEP) > limit)
        pad.x -= (game.padSpec.speed * TIME_STEP);
    else
        pad.x = limit;
}

function right(pad: coordinates, game: Game, limit: number) {
    if (pad.x + (game.padSpec.speed * TIME_STEP) < limit)
        pad.x += (game.padSpec.speed * TIME_STEP)
    else
        pad.x = limit;
}

