import { cTitle } from "./web-elements/typography/typography.js";

import { inputGroup, fileUpload } from "./web-elements/inputs/fields.js";

import { checkBox, radioBtn } from "./web-elements/inputs/buttons.js";

import { menuButton } from "./web-elements/navigation/buttons.js";

window.addEventListener("error", (e) => {
  console.error("Global error:", e.error);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason);
});

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
function createBtn(content: string): menuButton {
  const btn = document.createElement("button", {
    is: "menu-button",
  }) as menuButton;
  btn.content = content;
  return btn;
}

/**
 * Creates a custom heading element with specified level and content.
 *
 * @param {string} level - The heading level (up to "3" - defaults to 1).
 * @param {string} content - Content of the heading.
 * @returns {cTitle} The created element.
 *
 * @example
 * const heading = createHeading("3", "Section Title");
 * document.body.appendChild(heading);
 */
function createHeading(level: string, content: string): cTitle {
  const h = document.createElement("c-title") as cTitle;
  h.setAttribute("level", level);
  h.content = content;

  return h;
}

/**
 * Creates a custom file upload input element.
 *
 * @param id - The id to assign to the file input.
 * @returns A fileUpload custom element instance.
 *
 * @example
 * const fileInput = createUploadInput("profile-pic");
 * document.body.appendChild(fileInput);
 */

function createUploadInput(id: string): fileUpload {
  const input = document.createElement("input", {
    is: "file-upload",
  }) as fileUpload;
  input.setAttribute("type", "file");
  input.setAttribute("id", id);
  return input;
}

/**
 * Creates a custom input group element.
 *
 * @param type - Input type (e.g., "text", "username").
 * @param placeholder - Placeholder text for the input.
 * @param id - ID for input and label association.
 * @param pattern - Validation pattern for input.
 * @param content - Label text content.
 * @returns The configured input-grp custom element.
 *
 * @example
 * wrapper.appendChild(createInputGrp("username", "Enter username", "usernameInput", "^[a-zA-Z0-9]{4,18}$", "username:"));
 */
function createInputGrp(
  type: string,
  placeholder: string,
  id: string,
  pattern: string,
  content: string
): HTMLDivElement {
  const el = document.createElement("div", { is: "input-grp" }) as inputGroup;

  el.inputType = type;
  el.inputPattern = pattern;
  el.inputPlaceholder = placeholder;
  el.inputId = id;
  el.labelId = id;
  el.labelContent = content;
  return el;
}

/**
 * Creates a custom radio button element.
 *
 * @param btnName - name attribute for the internal radio input.
 * @param btnId - id attribute for the internal radio input.
 * @returns A radioBtn custom element as an HTMLDivElement.
 *
 * @example
 * wrapper.appendChild(createRadioBtn("radio-group", "radio-1"));
 */
function createRadioBtn(btnName: string, btnId: string): HTMLDivElement {
  const radio = document.createElement("div", { is: "radio-btn" }) as radioBtn;
  radio.inputId = btnId;
  radio.inputName = btnName;
  return radio;
}

/**
 * Creates a custom checkbox element.
 *
 * @param btnName - name attribute for the internal checkbox input.
 * @param btnId - id attribute for the internal checkbox input.
 * @returns A checkBtn custom element as an HTMLDivElement.
 *
 * @example
 * wrapper.appendChild(createCheckbox("checkbox-group", "checkbox1"));
 */

function createCheckbox(btnName: string, btnId: string): HTMLDivElement {
  const el = document.createElement("div", { is: "check-btn" }) as checkBox;
  el.inputId = btnId;
  el.inputName = btnName;
  return el;
}

const wrapper = document.createElement("div");
wrapper.classList.add("grid", "gap-6", "justify-center", "w-[100vw]");

wrapper.appendChild(createHeading("1", "Heading 1"));
wrapper.appendChild(createHeading("2", "Heading 2"));
wrapper.appendChild(createHeading("3", "Heading 3"));
wrapper.appendChild(createUploadInput("upload"));
wrapper.appendChild(
  createInputGrp(
    "text",
    "Username",
    "username",
    "^[a-zA-Z0-9]{4,18}$",
    "Username"
  )
);
wrapper.appendChild(createBtn("test"));
wrapper.appendChild(createRadioBtn("radio", "test"));
wrapper.appendChild(createCheckbox("check", "test"));

document.body.append(wrapper);

if (import.meta.hot) {
  import.meta.hot.accept();
}
