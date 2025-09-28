import { renderLobby } from "../../pages/html.pages.js";
import { wsConnect } from "./wsConnect.js";

export function lobby() {
  renderLobby();
  wsConnect();
}