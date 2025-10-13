import { pong } from '../game/pong.js';
let wsInstance: any = null;

function openWsConnection() {
    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
        return wsInstance;
    }
    wsInstance = new WebSocket('wss://localhost:8443/api/game/lobby');
    return wsInstance;
}

function wsConnect() {
    const ws: WebSocket = openWsConnection();

    ws.onerror = (err: any) => {
        console.log("error:", err);
        return; //TODO: handle error properly
    }

    ws.onopen = () => {
        console.log("WebSocket connection established!")

        ws.onmessage = (message: any) => {
            // console.log("Client received WS message!");
            
            const gameRequest/* : gameRequest */ = JSON.parse(message.data);
            const gameID: number = gameRequest.gameID;
            if (gameRequest.event === "declined") {
                console.log("Error: Failed to start game: #" + gameID);
            } else {
                console.log("Client ready to connect game #" + gameID);
                // ws connect to "/game/match"
                // send userID + gameID
                pong(message.data);
            }
        }

        // TODO: this ugly, make pretty
        const startButton = document.getElementById('start-tournament-btn');
        if (startButton && ws.readyState === WebSocket.OPEN) {
            startButton.addEventListener('click', () => {
                const message = createRequestForm();
                console.log("Client sending following to GM:\n", message);
                ws.send(message);
            });
        }
    }

    ws.onclose = () => {
        console.log("WebSocket connection closed!");
        // TODO: Check wether deconnection was expected or not 
    }
}

// TODO: this ugly, make pretty
function createRequestForm(): string {
    const requestForm = {
        event: "TOURNAMENT_REQUEST",
        payload: {
            format: "tournament",
            remote: "true",
            players: "4",
            users: [
                { userID: 1, username: "sam" },
                { userID: 2, username: "alex" },
                { userID: 3, username: "cha" },
                { userID: 4, username: "coco" }
            ]
        }
    };

    return JSON.stringify(requestForm);
}

export { wsConnect };