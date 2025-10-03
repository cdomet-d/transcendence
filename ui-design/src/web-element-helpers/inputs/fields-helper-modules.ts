import { inputGroup, fileUpload } from "../../web-elements/inputs/fields";

/**
 * Interface representing the structure of an input field.
 *
 * @property labelContent - The text content for the input's label.
 * @property id - The unique identifier for the input element.
 * @property pattern - The regex pattern for input validation.
 * @property placeholder - Placeholder text displayed inside the input.
 * @property type - The type attribute of the input (e.g., "text", "email").
 *
 * @example
 * const inputField: InputField = {
 *   labelContent: "Username",
 *   id: "username",
 *   pattern: "^[a-zA-Z0-9]{3,10}$",
 *   placeholder: "Enter your username",
 *   type: "text"
 * };
 */
export interface InputField {
  labelContent: string;
  id: string;
  pattern: string;
  placeholder: string;
  type: string;
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
export function createInputGrp(fieldData: InputField): HTMLDivElement {
  const el = document.createElement("div", { is: "input-grp" }) as inputGroup;

  el.inputType = fieldData.type;
  el.inputPattern = fieldData.pattern;
  el.inputPlaceholder = fieldData.placeholder;
  el.inputId = fieldData.id;
  el.labelId = fieldData.id;
  el.labelContent = fieldData.labelContent;
  return el;
}
