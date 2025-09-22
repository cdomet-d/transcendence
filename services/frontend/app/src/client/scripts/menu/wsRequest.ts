function wsRequest() {
    const ws = new WebSocket('wss://localhost:8443/api/game/menu');

    ws.onerror = (err) => {
        console.log("error:", err);
        return; //TODO: handle error properly
    }

    ws.onopen = () => {
        console.log("WebSocket connection established!")
        ws.onmessage = (event) => {
            console.log("message from server:", event.data);
        }

        const opponentBtn = document.getElementById('look-opponent-btn');
        if (opponentBtn &&  ws.readyState === WebSocket.OPEN) {
            opponentBtn.addEventListener('click', () => {
                const message = JSON.stringify({
                    event: "GAME_REQUEST_FORM",
                    payload: {
                        format: "quickMatch",
                        remote: "false",
                        players: "2",
                        userID: "1",
                        username: "sam"
                    }
                });
                ws.send(message);
                console.log("1")
            });
        }
    }
}

export { wsRequest };