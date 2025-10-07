import { checkBox, radioBtn } from '../../web-elements/inputs/buttons';
/**
 * Creates a custom radio button element.
 *
 * @param btnName - The name attribute for the radio input.
 * @param btnId - The id attribute for the radio input.
 * @returns A {@link radioBtn} custom element as an HTMLDivElement.
 *
 * @example
 * wrapper.appendChild(createRadioBtn("radio-group", "radio-1"));
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
 * @example
 * wrapper.appendChild(createCheckbox("checkbox-group", "checkbox1"));
 */
export function createCheckbox(btnName: string, btnId: string): HTMLDivElement {
    const el = document.createElement('div', { is: 'check-btn' }) as checkBox;
    el.inputId = btnId;
    el.inputName = btnName;
    return el;
}
