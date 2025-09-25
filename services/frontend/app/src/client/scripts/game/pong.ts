import { renderGame } from "./game.render.utils.js";
import { Game } from "./game.class.js";

function pong() {
	const ctx = getCanvasContext();
	if (!ctx) {
		console.log("error: context not supported");
		process.exit(1); //TODO: can't exit
	}
	const game: Game = new Game(ctx);
	renderGame(game);
	import("./ws.req.js").then(({ wsRequest }) => {
        wsRequest(game);
    }) //TODO: can import fail ?
}

function getCanvasContext(): CanvasRenderingContext2D | null {
	const canvas = document.getElementById("canvas") as HTMLCanvasElement;
	const ctx = canvas.getContext('2d');
	return ctx;
}

// window.addEventListener("load", );

export { pong };