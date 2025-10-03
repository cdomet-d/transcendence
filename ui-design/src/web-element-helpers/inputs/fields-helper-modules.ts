import { inputGroup, fileUpload } from "../../web-elements/inputs/fields";

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

export function createUploadInput(id: string): fileUpload {
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
export function createInputGrp(
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