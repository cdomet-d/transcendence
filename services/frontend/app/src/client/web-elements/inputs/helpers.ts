import { InputGroup, TextAreaGroup } from './fields.js';
import { Checkbox, RadioButton, RadioFieldSet } from './buttons.js';
import type { InputFieldsData, Radio } from '../types-interfaces.js';

/**
 * Creates a custom input group container.
 *
 * @param fieldData - Object describing input field details of type {@link InputFieldsData}. If none is set, it defaults to a text input with username patterning.
 * @returns The specialized {@link InputGroup} div element.
 */
export function createInputGroup(fieldData: InputFieldsData): InputGroup {
    const el = document.createElement('div', { is: 'input-and-label' }) as InputGroup;
    el.info = fieldData;
    return el;
}

export function createTextAreaGroup(fieldData: InputFieldsData): TextAreaGroup {
    const el = document.createElement('div', { is: 'textarea-and-label' }) as TextAreaGroup;
    el.info = fieldData;
    return el;
}

/**
 * Creates a custom radio button element.
 *
 * @param btnName - The name attribute for the radio input.
 * @param btnId - The id attribute for the radio input.
 * @returns A {@link RadioButton} custom element as an HTMLDivElement.
 *
 */
export function createRadioButton(btnName: string, btnId: string): RadioButton {
    const el = document.createElement('div', { is: 'radio-button' }) as RadioButton;
    el.inputId = btnId;
    el.inputName = btnName;
    return el;
}

/**
 * Creates a custom Checkbox element.
 *
 * @param btnName - The name attribute for the Checkbox input.
 * @param btnId - The id attribute for the Checkbox input.
 * @returns A {@link Checkbox} custom element as an HTMLDivElement.
 *
 */
export function createCheckbox(btnName: string, btnId: string): Checkbox {
    const el = document.createElement('div', { is: 'checkbox-input' }) as Checkbox;
    el.inputId = btnId;
    el.inputName = btnName;
    return el;
}

export function createFieldset(data: Radio): RadioFieldSet {
    const el = document.createElement('fieldset', { is: 'radio-fieldset' }) as RadioFieldSet;
    el.buttons = data;
    return el;
}
