import {
  inputLabel,
  menuButton,
  cTitle,
  fileUpload,
  textInput,
  radioBtn
} from "./atoms.js";

/**
 * Creates a menu button element with specified text content.
 *
 * This function creates a custom button element of type `menuButton`,
 * sets its display text, and returns it.
 *
 * @param {string} content - The text content to display inside the button.
 * @returns {menuButton} The created menuButton element.
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
 * This function creates a `c-title` element, sets its heading level (defaults to 1),
 * and sets the displayed text content.
 *
 * @param {string} level - The heading level (e.g., "1" for h1, "2" for h2, up to "3").
 * @param {string} content - The textual content to show inside the heading.
 * @returns {cTitle} The created custom heading element.
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
 * This function creates an input element of type "file" that is extended
 * by the custom element `fileUpload`. The input element receives the
 * specified id.
 *
 * @param {string} id - The id to assign to the file input element.
 * @returns {fileUpload} A fileUpload custom element representing a file input.
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
 * Creates a custom text input element with specified attributes.
 *
 * Note: prefer using `createWrappedTextInput` which encapsulates the input, label and wrapper generation.
 *
 * @param {string} type - The type of the input (e.g., "text", "password", "password").
 * @param {string} placeholder - Placeholder text displayed when the input is empty.
 * @param {string} id - Unique identifier for the input element.
 * @param {string} pattern - Regular expression pattern the input value must match for validation.
 *
 * @returns {textInput} The created custom text input element.
 */
function createTextInput(
  type: string,
  placeholder: string,
  id: string,
  pattern: string
): textInput {
  const input = document.createElement("input", {
    is: "text-input",
  }) as textInput;
  input.setAttribute("type", type);
  input.setAttribute("placeholder", placeholder);
  input.setAttribute("id", id);
  input.setAttribute("pattern", pattern);
  return input;
}

/**
 * Creates a custom label element linked to an input element.
 *
 * Note: prefer using `createWrappedTextInput` which encapsulates the input, label and wrapper generation.
 *
 * @param {string} content - The text content of the label.
 * @param {string} id - The id of the input element the label is associated with.
 * @returns {inputLabel} The created custom input label element.*/

function createLabel(content: string, id: string): inputLabel {
  const label = document.createElement("label", {
    is: "input-label",
  }) as inputLabel;
  label.setAttribute("for", id);
  label.content = content;
  return label;
}

/**
 * Creates a wrapper element for grouping an input and its label.
 *
 * Note: prefer using `createWrappedTextInput` which encapsulates the input, label and wrapper generation.
 *
 * @returns {HTMLElement} The wrapper container element.
 */
function createInputLabelWrapper(): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.classList.add("w-full", "box-border", "relative");
  return wrapper;
}

/**
 * Generates a container element that wraps a text input of the specified type,
 * with the given placeholder, id, and pattern validation. It also appends a label for the input,
 * setting its content and linking it to the input via the id.
 *
 * @param {string} type - The type attribute for the input element (e.g., "text", "password").
 * @param {string} placeholder - The placeholder text displayed inside the input when empty.
 * @param {string} id - The id attribute to uniquely identify the input element.
 * @param {string} pattern - The regex pattern used for input validation.
 * @param {string} content - The text content for the label associated with the input.
 *
 * @returns {HTMLElement} The wrapper element containing the input and its label.
 *
 * @example
 * const wrappedInput = createWrappedTextInput(
 *   "Username",
 *   "Enter your username",
 *   "username",
 *   "^[a-zA-Z0-9]{4,18}$",
 *   "Username"
 * );
 * document.body.appendChild(wrappedInput);
 */
function createWrappedTextInput(
  type: string,
  placeholder: string,
  id: string,
  pattern: string,
  content: string
): HTMLElement {
  const wrapper = createInputLabelWrapper();
  wrapper.appendChild(createTextInput(type, placeholder, id, pattern));
  wrapper.appendChild(createLabel(content, id));
  return wrapper;
}


const wrapper = document.createElement("div");

wrapper.classList.add("grid", "gap-6", "justify-center", "w-[100vw]");
wrapper.appendChild(createHeading("1", "Heading 1"));
wrapper.appendChild(createHeading("2", "Heading 2"));
wrapper.appendChild(createHeading("3", "Heading 3"));
wrapper.appendChild(createUploadInput("upload"));
wrapper.appendChild(
  createWrappedTextInput(
    "text",
    "Username",
    "username",
    "^[a-zA-Z0-9]{4,18}$",
    "Username"
  )
);
wrapper.appendChild(createBtn("test"));

const radio = document.createElement("radio-btn") as radioBtn;
// const radio = document.createElement("radio-btn") as radioBtn;
wrapper.appendChild(radio);

document.body.append(wrapper);

if (import.meta.hot) {
  import.meta.hot.accept();
}
