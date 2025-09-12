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

function renderMM(main: HTMLElement) {

	main.innerHTML = `
		<div class="relative min-h-screen bg-white-100">
		  <div class="flex justify-center items-center h-screen">
		    <button id="play-btn" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all text-lg">
		      Find opponent
		    </button>
		  </div>
		  <a
		  	href="/central"
			data-link
		    class="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-yellow-300 to-orange-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all text-lg"
		  >
		    Back
		  </a>
		</div>
	`;
}

export { matchmaking };
