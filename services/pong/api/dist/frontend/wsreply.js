function wsRequest() {
    const ws = new WebSocket('wss://localhost:8443/game/match');
    ws.onerror = (err) => {
        console.log("error:", err);
        process.exit(1);
    };
    ws.onopen = () => {
        console.log("WebSocket connection established!");
        ws.send("hey server");
    };
    ws.onmessage = (event) => {
        console.log("message from server:", event.data);
    };
}
export { wsRequest };
