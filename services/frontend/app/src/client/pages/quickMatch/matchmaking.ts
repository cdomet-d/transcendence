
function renderMM(main: HTMLElement) {

	main.innerHTML = `
<body>
	<div>
		<button id="play-btn">Find opponent</button>
	<div>
</body>`;
}

function matchmaking(socket: WebSocket, main: HTMLElement) {

	renderMM(main);

	const button = document.getElementById("play-btn") as HTMLButtonElement;
	if (button)
		button.addEventListener("click", () => requestMatchWS(socket));
}

function requestMatchWS(socket: WebSocket) {
	socket.send("create 1vs1");
	console.log("Looking for opponent");
}

export { matchmaking };
