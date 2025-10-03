import { menuButton } from "../../web-elements/navigation/buttons";
/**
 * Creates a menu button element with specified text content.
 *
 * @param {string} content - Content of the button.
 * @returns {menuButton} The created element.
 *
 * @example
 * const btn = createBtn("Click me");
 * document.body.appendChild(btn);
 */
export function createBtn(content: string): menuButton {
  const btn = document.createElement("button", {
	is: "menu-button",
  }) as menuButton;
  btn.content = content;
  return btn;
}