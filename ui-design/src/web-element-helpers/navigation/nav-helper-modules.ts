import { menuButton } from "../../web-elements/navigation/buttons";
import { tab, tabGroup } from "../../web-elements/navigation/buttons.js";

/**
 * Represents a tab with identifying data and display content.
 *
 * @property data - The identifier or key for the tab.
 * @property content - The visible text or content for the tab button.
 *
 * @example
 * const exampleTab: Tab = {
 *   data: "home",
 *   content: "Home",
 * };
 */
export interface Tab {
  data: string;
  content: string;
}

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

/**
 * Creates a tab group container element with buttons for each tab.
 * Each button is linked to a Tab object with data and content.
 * The first button gets the 'selected' attribute by default.
 *
 * @param tabList - Array of Tab objects to create buttons for.
 * @returns HTMLDivElement - A div element extended as tabGroup containing tab buttons.
 *
 * @example
 * const tabs: Array<Tab> = [
 * { data: "history", content: "Game history" },
 * { data: "stats", content: "Statistics" },
 * { data: "friends", content: "Friends" },
 * ];
 * wrapper.appendChild(nav.createTabs(tabs));
 */
export function createTabs(tabList: Array<Tab>): HTMLDivElement {
  const tabWrap = document.createElement("div", {
    is: "tab-group",
  }) as tabGroup;

  tabList.forEach((Tab) => {
    const el = document.createElement("button", { is: "tab-button" }) as tab;
    el.setAttribute("data-tab", Tab.data);
    el.textContent = Tab.content;
    tabWrap.appendChild(el);
  });
  tabWrap.firstElementChild?.setAttribute("selected", "");
  return tabWrap;
}
