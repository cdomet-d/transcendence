import * as types from '../../types-interfaces';
import * as defaults from '../../default-values';
import { createInputGroup, createTextAreaGroup } from '../inputs/helpers';
import { createBtn } from '../navigation/helpers';

export class UserSettingsForm extends HTMLFormElement {
	#username: string;
    #inputFields: types.InputMetadata[];
    #biography: types.InputMetadata;
    #submit: types.buttonData;

    constructor() {
        super();
		this.#username = '';
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
    }

	set setUsername(username: string) {
		this.#username = username;
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
        this.append(submit);
    }

    render() {
        this.action = `/account/settings/${this.#username}`;
        this.method = 'patch';
        this.renderFields();
        this.renderButtons();
        this.className =
            'grid gap-y-(--space-m) pad-sm';
    }
}

if (!customElements.get('settings-form')) {
    customElements.define('settings-form', UserSettingsForm, { extends: 'form' });
}

export class UserSettingsWrapper extends HTMLDivElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.render();
	}

	render() {
		this.className = 'brdr w-5xl grid sidebar-left justify-items-center gap-s'
	}
}

if (!customElements.get('settings-wrapper')) {
	customElements.define('settings-wrapper', UserSettingsWrapper, {extends: 'div'})
}