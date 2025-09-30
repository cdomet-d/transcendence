export class menuButton extends HTMLButtonElement {
  constructor() {
    super();
  }

  connectedCallback(value: string) {
    this.render(value);
  }

  render(value: string) {
    document.createElement("button");
    this.classList.add(
      "w-[100%]",
      "h-[90%]",
      "brdr",
      "yellow-bg",
      "input-emphasis",
      "overflow-hidden",
      "outline-hidden",
      "border-box",
      "flex",
      "justify-center",
      "items-center"
    );
    this.textContent = value;
  }
}

customElements.define('menu-button', menuButton, {extends: 'button'});