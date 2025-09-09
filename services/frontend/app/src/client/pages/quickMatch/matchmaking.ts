function matchmaking(socket: WebSocket, main: HTMLElement, message: string) {
	// renderPage();

	if (message === "quickMatch") {
		console.log("handling Quick Match request");
		socket.send("quickMatch");
	} else if (message === "tournament") {
		console.log("handling Tournament request");
		socket.send("tournament");
	} else {
		console.log("WS message unclear..");
	}
}

export { matchmaking };
