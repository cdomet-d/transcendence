import { InputGroup, TextAreaGroup } from './fields';
import { type InputFieldsData } from '../../types-interfaces';
import { Checkbox, RadioButton } from './buttons';
import { UserSettingsForm } from '../users/settings';
import * as types from '../../types-interfaces';

/**
 * Creates a custom input group container.
 *
 * @param fieldData - Object describing input field details of type {@link InputFieldsData}. If none is set, it defaults to a text input with username patterning.
 * @returns The specialized {@link InputGroup} div element.
 */
export function createInputGroup(fieldData: InputFieldsData): HTMLDivElement {
    const el = document.createElement('div', { is: 'input-and-label' }) as InputGroup;
    el.info = fieldData;
    return el;
}

export function createTextAreaGroup(fieldData: InputFieldsData): HTMLDivElement {
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
export function createRadioButton(btnName: string, btnId: string): HTMLDivElement {
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
export function createCheckbox(btnName: string, btnId: string): HTMLDivElement {
    const el = document.createElement('div', { is: 'checkbox-input' }) as Checkbox;
    el.inputId = btnId;
    el.inputName = btnName;
    return el;
}

export function singleInputForm(): HTMLFormElement {
    const el = document.createElement('form');

    el.className = 'items-center box-border grid sidebar-right search-gap w-full relative';
    return el;
}

export function createUserSettingsForm(
    user: types.UserData,
    form: types.formDetails,
): UserSettingsForm {
    const el = document.createElement('form', { is: 'settings-form' }) as UserSettingsForm;
    el.user = user;
    el.details = form;
    return el;
}
