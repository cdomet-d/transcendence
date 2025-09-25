import type { Game, playerTab } from '../classes/game.class.js';
import { updatePaddlePos } from './paddle.js';
import type { Player, repObj } from '../classes/player.class.js';
import type { WebSocket } from 'ws';

export interface keysObj {
	_w: boolean,
	_s: boolean,
	_ArrowUp: boolean,
	_ArrowDown: boolean,
	[key: string]: boolean,
}

export interface messObj {
	_keys: keysObj,
	_timeStamp: number,
}

export function setUpGame(game: Game) {
    game.setLeftPaddle();
    game.setRightPaddle();

    if (!game.players[0] || !game.players[1])
            return; //TODO: deal with that
    const leftPlayer: Player = game.players[0];
    const rightPlayer: Player = game.players[1];
    if (game.local)
        setPaddleEventLocal(leftPlayer.socket, leftPlayer, rightPlayer);
    else {
        setPaddleEventRemote(leftPlayer, rightPlayer, "left");
        setPaddleEventRemote(rightPlayer, leftPlayer, "right");
    }

    //TODO: send info to display game screen (users names) or is it gameManager's job?
    // startGame(game);
}

function keysDown(keys: keysObj): boolean {
    for (const key in keys) {
        if (keys[key])
            return true;
    }
    return false
}

function setPaddleEventLocal(socket: WebSocket, leftPlayer: Player, rightPlayer: Player) {
    let lastFrameTime: number = 0;
    socket.on("message", (payload: any) => {
        const mess: messObj = JSON.parse(payload);
        const keys: keysObj = mess._keys;
        const delta: number = mess._timeStamp - lastFrameTime;
        lastFrameTime = mess._timeStamp;
        if (!keysDown(keys))
            return;
        updatePaddlePos(leftPlayer, {_w: keys._w, _s: keys._s, _ArrowUp: false, _ArrowDown: false}, delta);
        updatePaddlePos(rightPlayer, {_w: false, _s: false, _ArrowUp: keys._ArrowUp, _ArrowDown: keys._ArrowDown}, delta);
        leftPlayer.setMess("left", leftPlayer.paddle.y);
        leftPlayer.setMess("right", rightPlayer.paddle.y);
        const rep: repObj = leftPlayer.mess;
        socket.send(JSON.stringify(rep));
    })
}

function setPaddleEventRemote(sender: Player, receiver: Player, side: string) {
    let lastFrameTime: number = 0;
    sender.socket.on("message", (payload: any) => {
       const mess: messObj = JSON.parse(payload);
        const keys: keysObj = mess._keys;
        const delta: number = mess._timeStamp - lastFrameTime;
        lastFrameTime = mess._timeStamp;
        updatePaddlePos(sender, keys, delta);
        sender.setMess(side, sender.paddle.y);
        const rep: repObj = sender.mess;
        if (sender.socket.readyState === 1)
            sender.socket.send(JSON.stringify(rep));
        if (receiver.socket.readyState === 1)
            receiver.socket.send(JSON.stringify(rep));
    })
}



// function setMessEvent(socket: WebSocket, callback: Function) {
//     socket.on("message", (payload: any) => {
//         const mess: keys = JSON.parse(payload);
//     })
// }