import {
  menuButton,
  tabPanel,
  tabWrapper,
} from "../../web-elements/navigation/buttons";
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
  default: boolean;
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

function tabDataIsUnique(tabList: Array<Tab>): boolean {
  return tabList.every(
    (item, i, self) => i === self.findIndex((t) => t.data === item.data)
  );
}
``;
function createTabButtons(tabList: Array<Tab>): HTMLDivElement {
  const tabHeader = document.createElement("div", {
    is: "tab-group",
  }) as tabGroup;

  tabList.forEach((tab) => {
    const el = document.createElement("button", { is: "tab-button" }) as tab;
    el.setAttribute("data-tab", tab.data);
    el.textContent = tab.content;
    console;
    if (tab.default) el.setAttribute("selected", "");
    tabHeader.appendChild(el);
  });
  return tabHeader;
}

/**
 * Creates a tab group container element with buttons for each tab.
 * Each button is linked to a Tab Panel with data and content.
 * 
 * @param {Array<Tab>} tabInfo - Array of Tab objects to create buttons for. Each Tab.data must be unique to ensure each button is correctly linked to its associated panel.
 * @returns HTMLDivElement - A div element containing tabs and panels.
 *
 * Function throws an exception if `tabInfo` contains duplicate 'data' elements.
 * @example
 * const tabs: Array<Tab> = [
 * { data: "history", content: "Game history", default: true },
 * { data: "stats", content: "Statistics", default: false },
 * { data: "friends", content: "Friends", default: false },
];
 * wrapper.appendChild(nav.createTabs(tabs));
 */
export function createTabs(tabInfo: Array<Tab>): HTMLDivElement {
  if (!tabDataIsUnique(tabInfo)) {
    throw new Error(
      "Duplicate Tab.data will lead to UI confusion. Check your TabInfo array."
    );
  }
  const container = document.createElement("div", {
    is: "tab-wrapper",
  }) as tabWrapper;

  container.appendChild(createTabButtons(tabInfo));

  tabInfo.forEach((tab) => {
    const el = document.createElement("div", { is: "tab-panel" }) as tabPanel;
    el.setAttribute("data-content", tab.data);
    el.textContent = tab.content;
    if (tab.default) {
      el.setAttribute("selected", "");
    }
    container.appendChild(el);
  });
  return container;
}
