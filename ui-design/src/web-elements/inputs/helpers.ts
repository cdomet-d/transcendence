import { inputGroup, fileUpload } from './fields';
import { type InputMetadata } from '../../types-interfaces';

/**
 * Creates a custom file upload input element.
 *
 * @param id - ID for the file input.
 * @returns A {@link fileUpload} custom element.
 *
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
 * @param fieldData - Object describing input field details of type {@link InputMetadata}. If none is set, it defaults to a text input with username patterning.
 * @returns The specialized {@link inputGroup} div element.
 */
export function createInputGrp(fieldData: InputMetadata): HTMLDivElement {
    const el = document.createElement('div', { is: 'input-grp' }) as inputGroup;
    el.info = fieldData;
    return el;
}

import { checkBox, radioBtn } from './buttons';
/**
 * Creates a custom radio button element.
 *
 * @param btnName - The name attribute for the radio input.
 * @param btnId - The id attribute for the radio input.
 * @returns A {@link radioBtn} custom element as an HTMLDivElement.
 *
 */
export function createRadioBtn(btnName: string, btnId: string): HTMLDivElement {
    const el = document.createElement('div', { is: 'radio-btn' }) as radioBtn;
    el.inputId = btnId;
    el.inputName = btnName;
    return el;
}

/**
 * Creates a custom checkbox element.
 *
 * @param btnName - The name attribute for the checkbox input.
 * @param btnId - The id attribute for the checkbox input.
 * @returns A {@link checkBox} custom element as an HTMLDivElement.
 *
 */
export function createCheckbox(btnName: string, btnId: string): HTMLDivElement {
    const el = document.createElement('div', { is: 'check-btn' }) as checkBox;
    el.inputId = btnId;
    el.inputName = btnName;
    return el;
}
