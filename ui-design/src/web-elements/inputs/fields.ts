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
      "input-emphasis",
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
    this.classList.add("brdr input-emphasis");
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

export class inputGroup extends HTMLDivElement {
  input: textInput;
  label: inputLabel;

  set labelId(val: string) {
    this.label.setAttribute("for", val);
  }
  set labelContent(content: string) {
    this.label.content = content;
  }
  set inputId(val: string) {
    this.input.id = val;
  }
  set inputPattern(val: string) {
    this.input.pattern = val;
  }
  set inputPlaceholder(val: string) {
    this.input.placeholder = val;
  }
  set inputType(type: string) {
    this.input.type = type;
  }

  constructor() {
    super();

    this.input = document.createElement("input", {
      is: "text-input",
    }) as textInput;
    this.label = document.createElement("label", {
      is: "input-label",
    }) as inputLabel;

    this.appendChild(this.input);
    this.appendChild(this.label);
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.className = "w-full box-border relative";
  }
}

customElements.define("input-grp", inputGroup, { extends: "div" });
