import { renderGame } from './game-render-utils.js';
import { Game, HEIGHT, WIDTH, type requestMap } from './classes/game-class.js';
import type { repObj, reqObj } from './classes/game-interfaces.js';
import { movePaddle, updatePaddlePos } from './paddle.js';
import { deadReckoning, updateBallPos } from './ball.js';

const SERVER_TICK: number = 1000 / 60;
const TIME_STEP: number = 1000 / 60;
const MAX_UPDATES_PER_FRAME = 8;

export async function startGame(game: Game, ws: WebSocket) {
    game.lastFrameTime = performance.now();
    game.frameId = requestAnimationFrame(FrameRequestCallback(game, ws));
}

function FrameRequestCallback(game: Game, ws: WebSocket) {
    return function gameLoop(timestamp: number) {
        const latestReply: repObj | undefined = { ...game.replyHistory[game.replyHistory.length - 1]};
        if (latestReply !== undefined && game.reqHistory.has(latestReply.ID))
            if (reconciliation(game, { ...latestReply}, ws))
                return;

        game.delta += timestamp - game.lastFrameTime;
        game.lastFrameTime = timestamp;
        let updates: number = 0;
        while (game.delta >= TIME_STEP && updates < MAX_UPDATES_PER_FRAME) {
            sendRequest(game, ws);
            updatePaddlePos(game.leftPad, true, game, game.req.keys);
            if (game.local) 
                updatePaddlePos(game.rightPad, false, game, game.req.keys);
            else 
                interpolation(game);
            deadReckoning(game, latestReply);
            latestReply.timestamp -= TIME_STEP;
            finishSteps(game);
            game.delta -= TIME_STEP;
            updates++;
        }
        if (updates === MAX_UPDATES_PER_FRAME) 
            game.delta = 0;

        game.ctx.clearRect(0, 0, WIDTH, HEIGHT);
        renderGame(game);
        game.frameId = window.requestAnimationFrame(FrameRequestCallback(game, ws));
    };
}

function sendRequest(game: Game, ws: WebSocket) {
    game.req.timeStamp = performance.now();
    ws.send(JSON.stringify(game.req));
    game.addReq(game.req);
    game.req.ID += 1; //TODO: overflow?
}

function interpolation(game: Game) {
    const renderTime: number = performance.now() - SERVER_TICK;
    const updates: [repObj, repObj] | null = game.getReplies(renderTime);

    if (updates) {
        const t =
            (renderTime - updates[0].timestamp) / (updates[1].timestamp - updates[0].timestamp);
        game.rightPad.y = lerp(updates[0].rightPad.coord.y, updates[1].rightPad.coord.y, t);
        if (game.horizontal)
            game.rightPad.x = lerp(updates[0].rightPad.coord.x, updates[1].rightPad.coord.x, t);
        game.deleteReplies(game.replyHistory.indexOf(updates[0]) - 1);
    }
}

function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * Math.min(Math.max(t, 0), 1);
}

function reconciliation(game: Game, latestReply: repObj, ws: WebSocket): boolean {
    let id: number = latestReply.ID;
 
    if (applyServerState(game, latestReply, ws))
        return true;

    const sortedRequests = Array.from(game.reqHistory.entries()).filter(req => req[0] > id)    
    let lastTimestamp = game.reqHistory.get(id)!.timeStamp + TIME_STEP;
    game.deleteReq(id);
    let timeSinceUpdate: number = 0;

    for (const req of sortedRequests) {
        const deltaTime = req[1].timeStamp - lastTimestamp;
        let simulatedTime = 0;
        timeSinceUpdate = req[1].timeStamp - latestReply.timestamp;
        while (simulatedTime + TIME_STEP <= deltaTime) {
            const nextX: number = game.ball.x + game.ball.dx * timeSinceUpdate;
            const nextY: number = game.ball.y + game.ball.dy * timeSinceUpdate;
            updateBallPos(game, nextX, nextY, timeSinceUpdate);
            finishSteps(game);
            simulatedTime += TIME_STEP;
            timeSinceUpdate += TIME_STEP;
        }
         
        updatePaddlePos(game.leftPad, true, game, req[1].keys);
        if (game.local) 
            updatePaddlePos(game.rightPad, false, game, req[1].keys);
         
        lastTimestamp = req[1].timeStamp;
    }
    const last = sortedRequests.at(-1);
    if (last) {
        timeSinceUpdate = last[1].timeStamp - latestReply.timestamp;
        const nextX: number = game.ball.x + game.ball.dx * timeSinceUpdate;
        const nextY: number = game.ball.y + game.ball.dy * timeSinceUpdate;
        updateBallPos(game, nextX, nextY, timeSinceUpdate);
        finishSteps(game);
    }
    return false;
}

function applyServerState(game: Game, latestReply: repObj, ws: WebSocket): boolean {
    if (latestReply.score[0] != game.score[0] 
        || latestReply.score[1] != game.score[1])
        game.updateScore(latestReply);
    game.leftPad = latestReply.leftPad;
    if (game.local)
        game.rightPad = latestReply.rightPad;
    game.ball = latestReply.ball;
    if (latestReply.end === true) {
        ws.send("0");
        return true;
    }
    return false;
}

function finishSteps(game: Game) {
    if (game.leftStep.x != 0 || game.leftStep.y != 0) {
        movePaddle(game, game.leftPad, game.leftStep);
        game.setLeftStep();
    }
    if (game.local) {
        if (game.rightStep.x != 0 || game.rightStep.y != 0) {
            movePaddle(game, game.rightPad, game.rightStep);
            game.setRightStep();
        }
    }
}
