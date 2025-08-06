const ws = new WebSocket('ws://localhost:2020/game/match');

ws.onopen = () => {
    console.log("WebSocket connection established!")
    ws.send("hey server");
}

ws.onmessage = (event) => {
    console.log("message from server:", event.data);
}
