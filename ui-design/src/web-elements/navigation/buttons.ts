export class menuButton extends HTMLButtonElement {
  static get observedAttributes() {
    return ["disabled"];
  }
  constructor() {
    super();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    if (name === "disabled")
      if (this.disabled) {
        this.classList.add("disabled", "clear-bg");
        this.classList.remove("yellow-bg");
      } else {
        this.classList.remove("disabled", "clear-bg");
        this.classList.add("yellow-bg");
      }
  }
  connectedCallback() {
    this.render();
  }
  set content(val: string) {
    this.textContent = val;
  }

  render() {
    this.classList.add(
      "w-[100%]",
      "h-[90%]",
      "brdr",
      "input-emphasis",
      "overflow-hidden",
      "outline-hidden",
      "border-box",
      "flex",
      "justify-center",
      "items-center"
    );
    if (this.disabled) {
      this.classList.add("disabled", "clear-bg");
    } else {
      this.classList.add("yellow-bg");
    }
  }
}

customElements.define("menu-button", menuButton, { extends: "button" });

/**
 * Custom tab button element extending HTMLButtonElement.
 * Toggles styling based on the presence of the "selected" attribute.
 *
 * Observed attribute: "selected"
 *
 * @property content - Setter to update the button's text content.
 *
 * @example
 * const tab = document.createElement("button", { is: "tab" }) as tab;
 * tab.content = "Home";
 * tab.setAttribute("selected", "");
 * document.body.appendChild(tab);
 */
export class tab extends HTMLButtonElement {
  static get observedAttributes() {
    return ["selected"];
  }
  constructor() {
    super();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    if (name === "selected")
      if (this.hasAttribute("selected")) {
        this.classList.remove("yellow-bg", "brdr", "z-2");
        this.classList.add("selected-yellow-bg", "z-1");
      } else {
        this.classList.remove("selected-yellow-bg", "z-1");
        this.classList.add("yellow-bg", "brdr", "z-2");
      }
  }
  connectedCallback() {
    this.render();
  }

  set content(val: string) {
    this.textContent = val;
  }

  render() {
    this.classList.add(
      "tab",
      "z-2",
      "w-[100%]",
      "h-[100%]",
      "thin",
      "brdr",
      "overflow-hidden",
      "outline-hidden",
      "border-box",
      "flex",
      "justify-center",
      "items-center",
      "hover:transform-none"
    );
    if (this.hasAttribute("selected")) {
      this.classList.remove("yellow-bg", "brdr", "z-2");
      this.classList.add("selected-yellow-bg", "z-1");
    } else {
      this.classList.remove("selected-yellow-bg", "z-1");
      this.classList.add("yellow-bg", "brdr", "z-2");
    }
  }
}

customElements.define("tab-button", tab, { extends: "button" });

// const tabs = document.querySelectorAll<HTMLButtonElement>(".tab");

// tabs.forEach((tab) => {
//   tab.addEventListener("click", () => {
//     document
//       .querySelectorAll<HTMLElement>(".tab-panel")
//       .forEach((panel) => panel.removeAttribute("selected"));
// 	tabs.forEach(tab => tab.removeAttribute("selected"));

//     const clickedTab = tab.getAttribute("data-tab");
//     if (clickedTab) {
//       const panel = document.querySelector<HTMLElement>(
//         `.tab-panel[data-content="${clickedTab}"]`
//       );
//       if (panel) {
//         panel.setAttribute("selected", "");
// 		tab.setAttribute("selected", "");
//       }
//     }
//   });
// });

/**
 * Custom tab group container extending HTMLDivElement.
 * Manages a collection of tab buttons and handles tab selection.
 *
 * Adds a click event listener to switch tabs on user interaction.
 *
 * @property content - Setter to update the container's text content.
 *
 * @example
 * const tabs: Tab[] = [
 *   { data: "home", content: "Home" },
 *   { data: "profile", content: "Profile" },
 * ];
 * const tabGroup = document.createElement("div", { is: "tab-group" }) as tabGroup;
 * document.body.appendChild(tabGroup);
 */
export class tabGroup extends HTMLDivElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();

    this.addEventListener("click", (event: MouseEvent) => {
      const selected = event.target as HTMLElement;
      if (selected.matches(".tab")) {
        this.changeTab(this, selected);
      }
    });
  }

  render() {
    this.className =
      "w-[100%] h-s box-border grid grid-flow-col auto-cols-fr auto-rows-[1fr] justify-items-center";
  }

  changeTab(tabs: HTMLDivElement, target: HTMLElement) {
    const nodeArr = Array.from(tabs.children);
    nodeArr.forEach((node) => {
      node.removeAttribute("selected");
    });
    target.setAttribute("selected", "");
  }
}

customElements.define("tab-group", tabGroup, { extends: "div" });
