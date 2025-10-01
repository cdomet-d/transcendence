export class cTitle extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const level = this.getAttribute("level") || "1";
    this.render(level);
  }
  set content(val: string) {
    this.textContent = val;
  }

  render(level: string) {
    const validLevel = ["1", "2", "3"].includes(level) ? level : "1";
    this.innerHTML = `<h${validLevel} 
		class="f-yellow 
		text-center 
		title-shadow 
		t${validLevel} 
		leading-[130%]">${this.textContent}</h${validLevel}>`;
  }
}
customElements.define("c-title", cTitle);

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

export class fileUpload extends HTMLInputElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.classList.add(
      "brdr",
      "relative",
      "file:absolute",
      "file:top-[12%]",
      "file:left-[0.5rem]",
      "file:w-[5rem]",
      "file:h-[75%]"
    );
  }
}

customElements.define("file-upload", fileUpload, { extends: "input" });

export class textInput extends HTMLInputElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.classList.add("brdr");
  }
}

customElements.define("text-input", textInput, { extends: "input" });

export class inputLabel extends HTMLLabelElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  set content(val: string) {
    this.textContent = val;
  }

  render() {
    this.classList.add(
      "min-w-[fit-content]",
      "flex",
      "justify-center",
      "brdr",
      "clear-bg",
      "thin",
      "absolute",
      "right-[8px]",
      "-top-[8px]",
      "w-[10%]"
    );
  }
}

customElements.define("input-label", inputLabel, { extends: "label" });

export class radioBtn extends HTMLElement {
  // properties
  input: HTMLInputElement;
  check: HTMLSpanElement;

  //   static get observedAttributes() {
  //     return ["selected"];
  //   }

  constructor() {
    super();

	this.input = document.createElement("input");
	this.check = document.createElement("span");

    this.input.type = "radio";
    this.input.className =
      "peer m-0 z-2 cursor-pointer absolute top-[0] left-[0]";
    this.check.className =
      "thin brdr z-1 orange-bg absolute top-[0] left-[0] cursor-pointer w-[50%] h-[100%] peer-checked:absolute peer-checked:left-1/2 border-box";
    
	this.appendChild(this.input);
    this.appendChild(this.check);
  }

  //   attributesChangedCallback(name: string, oldValue: string, newValue: string) {}

  connectedCallback() {
    this.render();
  }

  render() {
	this.setAttribute("selected", "");
    this.classList.add(
      "box-border",
      "relative",
      "block",
      "border-none",
      "w-m",
      "h-s",
      "brdr",
      "clear-bg"
    );
  }
}

customElements.define("radio-btn", radioBtn);