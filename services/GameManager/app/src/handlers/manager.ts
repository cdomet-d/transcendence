import type { WebSocket } from '@fastify/websocket';

interface requestForm {
    format: "quick" | "tournament",
    remote: boolean,
    players: number
    username: string,
    userID: number
}

interface userInfo {
    userID: number,
    username: string
}

interface matchInfo {
    format: "quick" | "tournament",
    remote: boolean,
    players: number
}

interface match {
    matchID: number,
    format: "quick" | "tournament",
    remote: boolean,
    users: userInfo[],
    players: number,
    score: string,
    winner: userInfo,
    loser: userInfo,
}

export function handleMatchRequest(socket: WebSocket, data: any) {
    console.log(data.event);
    if (data.event !== "GAME_REQUEST_FORM") {
        // handle error;
        console.log(data.event);
        return;
    }
    
    // Decompose data
    const { format, remote, players, userID, username } = data.payload;

    const gameInfo = { format, remote, players };
    
    // Which subject do we publish to?
    let nats_subject: string = "pregame." +
    gameInfo.format + "." +
    (gameInfo.remote === "true" ? "remote." : "local.") +
    gameInfo.players + "." + 
    "create";
    
    console.log("Publishing to `", nats_subject, " `");
    
    // What are we sending them?
    const userInfo = { userID, username };
    // const jc = JSONCodec();
    // nc.publish(nats_subject, jc.encode(userInfo));
}