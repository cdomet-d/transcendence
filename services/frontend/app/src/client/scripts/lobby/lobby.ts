import { renderLobbyMenu } from "../../pages/html.pages.js";
import { attachLobbyMenuListeners } from "./wsConnect.js";

export function lobby() {
	renderLobbyMenu();
	attachLobbyMenuListeners();
	import("./wsConnect.js").then(({ wsConnect }) => {
		wsConnect();
	})
}
