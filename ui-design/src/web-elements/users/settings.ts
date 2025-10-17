import * as types from '../../types-interfaces';
import * as defaults from '../../default-values';
import { createInputGroup, createTextAreaGroup } from '../inputs/helpers';
import { createBtn } from '../navigation/helpers';

export class UserSettingsForm extends HTMLFormElement {
    #inputFields: types.InputMetadata[];
    #biography: types.InputMetadata;
    #submit: types.buttonData;
    #delete: types.buttonData;

    constructor() {
        super();
        this.#inputFields = [
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

            {
                type: 'file',
                pattern: '',
                id: 'upload',
                placeholder: '',
                labelContent: 'Profile picture',
            },
        ];
        this.#biography = {
            type: '',
            pattern: '',
            id: 'Biography',
            placeholder: 'Enter your biography',
            labelContent: 'Biography',
        };

        this.#submit = {
            type: 'submit',
            content: 'Submit changes',
            img: null,
            ariaLabel: 'Sunmit button for user settings form',
        };
        this.#delete = {
            type: 'button',
            content: 'Delete account',
            img: null,
            ariaLabel: 'Account deletion request',
            style: 'red',
        };
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

    renderButtons() {
        const submit = createBtn(this.#submit);
        const deleteAccount = createBtn(this.#delete);
        this.append(deleteAccount, submit);
    }

    render() {
        this.action = '/account/settings';
        this.method = 'patch';
        this.renderFields();
        this.renderButtons();
        this.className =
            'grid grid-cols-[37.8%_61%] gap-y-(--space-m) gap-x-(--space-s) w-5xl brdr pad-sm';
    }
}

if (!customElements.get('setting-forms')) {
    customElements.define('setting-forms', UserSettingsForm, { extends: 'form' });
}
