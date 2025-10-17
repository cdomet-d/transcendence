import * as types from '../../types-interfaces';
import * as defaults from '../../default-values';
import { createInputGroup, createTextAreaGroup } from '../inputs/helpers';

const profileFields: types.InputMetadata[] = [
    {
        type: 'text',
        pattern: defaults.usernamePattern,
        id: 'username',
        placeholder: 'Enter your new username!',
        labelContent: 'Username',
    },
    {
        type: 'password',
        pattern: defaults.passwordPattern,
        id: 'password',
        placeholder: 'Enter your new password!',
        labelContent: 'Password',
    },

    { type: 'file', pattern: '', id: 'upload', placeholder: '', labelContent: 'Profile picture' },
];

export const biography: types.InputMetadata = {
    type: '',
    pattern: '',
    id: 'Biography',
    placeholder: 'Enter your biography',
    labelContent: 'Biography',
};

export class UserSettingsForm extends HTMLFormElement {
    #inputFields: types.InputMetadata[];
    #biography: types.InputMetadata;

    constructor() {
        super();
        this.#inputFields = profileFields;
        this.#biography = biography;
    }

    connectedCallback() {
        this.render();
    }

    renderFields() {
        this.#inputFields.forEach((field) => {
            const el = createInputGroup(field);
            this.appendChild(el);
        });
        const el = createTextAreaGroup(this.#biography);
        this.appendChild(el);
    }

    render() {
        this.action = '/account/settings';
        this.method = 'patch';
        this.renderFields();
        this.className = 'grid gap-m';
    }
}

if (!customElements.get('setting-forms')) {
    customElements.define('setting-forms', UserSettingsForm, { extends: 'form' });
}
