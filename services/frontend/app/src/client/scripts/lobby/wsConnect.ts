let wsInstance: any = null;

interface userInfo {
    userID: number,
    username: string
}

interface requestForm {
    format: "quick" | "tournament",
    remote: boolean,
    players: number
    users: userInfo[]
}

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
            // console.log("message from server:", message.data);
            console.log("Client is ready to connect to Pong game");
            if (message.data === "game.ready") {
                ws.close();
            }
        }

        // TODO: this ugly, make pretty
        const startButton = document.getElementById('start-tournament-btn');
        if (startButton && ws.readyState === WebSocket.OPEN) {
            startButton.addEventListener('click', () => {
                const message = createRequestForm();
                ws.send(message);
                console.log(message);
            });
        }
    }

    ws.onclose = () => {
        console.log("WebSocket connection closed!");
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