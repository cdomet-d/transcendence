import { inputGroup, fileUpload } from '../../web-elements/inputs/fields';

/**
 * Represents the structure of an input field.
 *
 * @property labelContent - Text for the input's label.
 * @property id - Unique input element identifier.
 * @property pattern - Regex pattern for input validation.
 * @property placeholder - Placeholder text inside the input.
 * @property type - Input type attribute (e.g., "text", "email").
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
 * @param id - ID for the file input.
 * @returns A {@link fileUpload} custom element.
 *
 * @example
 * const fileInput = createUploadInput("profile-pic");
 * document.body.appendChild(fileInput);
 */
export function createUploadInput(id: string): fileUpload {
    const input = document.createElement('input', {
        is: 'file-upload',
    }) as fileUpload;
    input.setAttribute('type', 'file');
    input.setAttribute('id', id);
    return input;
}

/**
 * Creates a custom input group container.
 *
 * @param fieldData - Object describing input field details of type {@link InputField}. If none is set, it defaults to a text input with username patterning.
 * @returns The specialized {@link inputGroup} div element.
 *
 * @example
 * const inputField: InputField = {
 *   labelContent: "Username",
 *   id: "username",
 *   pattern: "^[a-zA-Z0-9]{3,10}$",
 *   placeholder: "Enter your username",
 *   type: "text"
 * }; * wrapper.appendChild(createInputGrp(inputField));
 */

export function createInputGrp(fieldData: InputField): HTMLDivElement {
    const el = document.createElement('div', { is: 'input-grp' }) as inputGroup;
    el.info = fieldData;
    return el;
}
