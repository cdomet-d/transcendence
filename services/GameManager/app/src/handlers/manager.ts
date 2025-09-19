import type { WebSocket } from '@fastify/websocket';

interface payload {
    format: string,
    remote: boolean,
    username: string,
    userID: number
}

interface userInfo {
    userID: number,
    username: string
}

interface matchInfo {
    format: string,
    remote: boolean,
    players: number
}

interface match {
    matchID: number,
    format: string,
    remote: boolean,
    users: userInfo[],
    players: number,
    score: string,
    winner: userInfo,
    loser: userInfo,
}

export function handleMatchRequest(socket: WebSocket, payload: string) {
    
    const obj = JSON.parse(payload);
    obj.username = "ok";
    // getUserInfo
    // getMatchInfo
    // 
    ;
}