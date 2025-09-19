import { renderGameMenu } from "../../pages/html.pages.js";
import { wsRequest } from "./wsRequest.js";

export function menu() {
  renderGameMenu();
  wsRequest();
}