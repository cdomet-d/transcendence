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
