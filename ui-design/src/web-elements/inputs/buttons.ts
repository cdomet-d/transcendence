export class radioBtn extends HTMLDivElement {
  input: HTMLInputElement;
  check: HTMLSpanElement;

  set inputName(val: string) {
    this.input.name = val;
  }

  set inputId(val: string) {
    this.input.id = val;
  }

  constructor() {
    super();

    this.input = document.createElement("input");
    this.check = document.createElement("span");
    this.input.type = "radio";
    this.input.className = "peer z-2 absolute top-[0] left-[0] cursor-pointer";
    this.check.className =
      "thin brdr z-1 orange-bg absolute top-[0] left-[0] cursor-pointer w-[50%] h-[100%] peer-checked:absolute peer-checked:left-1/2 border-box";

    this.appendChild(this.input);
    this.appendChild(this.check);
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.className =
      "box-border relative block border-none w-m h-s brdr clear-bg";
  }
}
customElements.define("radio-btn", radioBtn, { extends: "div" });

export class checkBox extends HTMLDivElement {
  input: HTMLInputElement;
  check: HTMLSpanElement;

  set inputName(val: string) {
    this.input.name = val;
  }
  set inputId(val: string) {
    this.input.id = val;
  }

  constructor() {
    super();

    this.input = document.createElement("input");
    this.check = document.createElement("span");
    this.input.type = "checkbox";
    this.input.className =
      "peer m-0 z-2 cursor-pointer absolute top-[0] left-[0]";
    this.check.className =
      "peer-checked:block z-1 hidden absolute top-[4.54px] left-[4.6px] cursor-pointer w-[65%] h-[65%] thin brdr orange-bg";
    this.appendChild(this.input);
    this.appendChild(this.check);
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.className =
      "w-s h-s border-box relative block border-none brdr clear-bg";
  }
}
customElements.define("check-btn", checkBox, { extends: "div" });
