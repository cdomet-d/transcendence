import { createAvatar, createHeading } from '../typography/helpers';
import { createBtn, createDropdown } from '../navigation/helpers';
import { createInputGroup, createTextAreaGroup } from '../inputs/helpers';
import * as defaults from '../../default-values';
import * as types from '../../types-interfaces';
import type { Avatar } from '../typography/images';
import type { DropdownMenu } from '../navigation/menus';
import type { InputGroup, TextAreaGroup } from '../inputs/fields';

export class UserSettingsForm extends HTMLFormElement {
    #user: types.UserData;
    #formData: types.formDetails;
    #colors: DropdownMenu;
    #languages: DropdownMenu;
    #avatar: Avatar;

	#submitHandler: (ev: SubmitEvent) => void;

    constructor() {
        super();
        this.#user = defaults.userDefault;
        this.#formData = defaults.userSettingsForm;
        this.#avatar = createAvatar(this.#user.avatar);
        this.#colors = createDropdown(defaults.userColorsMenu, 'Pick color', 'dynamic');
        this.#languages = createDropdown(defaults.languageMenu, 'Pick language', 'static');
		this.#submitHandler = this.submitHandler.bind(this);
	}

    set setUsername(details: types.UserData) {
        this.#user = details;
    }

    set setFormDetails(details: types.formDetails) {
        this.#formData = details;
    }

	submitHandler(ev: SubmitEvent) {
            ev.preventDefault();
            const f = new FormData(this);
            const colSelection = this.#colors.selectedElement;
            if (colSelection && 'bg-' + colSelection.id !== this.#user.profileColor)
                f.append('color', 'bg-' + colSelection.id);
            const langSelection = this.#languages.selectedElement;
            if (langSelection && langSelection.id !== this.#user.language)
                f.append('language', langSelection.id);
            console.log(f);
	}

    connectedCallback() {
        this.addEventListener('submit', (ev) => this.#submitHandler(ev));
        this.render();
    }

	disconnectedCallback() {
        this.removeEventListener('submit', (ev) => this.#submitHandler(ev));
	}

    renderDropdowns() {
        const dropdownWrapper = document.createElement('div');
        dropdownWrapper.append(this.#colors, this.#languages);
        dropdownWrapper.className = 'grid gap-s grid-flow-col z-1';
        this.append(dropdownWrapper);
    }

    renderFields() {
        this.#formData.fields.forEach((field) => {
            let el: HTMLElement;
            if (field.type !== 'textarea') {
                el = createInputGroup(field) as InputGroup;
            } else {
                el = createTextAreaGroup(field) as TextAreaGroup;
            }
            this.appendChild(el);
            if (field.type === 'textarea') el.classList.add('row-span-3');
        });
    }

    renderButtons() {
        const submit = createBtn(this.#formData.button);
        this.append(submit);
    }

    render() {
        const title = createHeading('1', 'Settings');

        this.action = this.#formData.action;
        this.ariaLabel = this.#formData.ariaLabel;
        this.className =
            'grid gap-y-(--space-m) pad-sm brdr w-5xl \
			grid sidebar-left justify-items-center gap-s';
        this.id = this.#formData.id;
        this.method = this.#formData.method;

        this.append(this.#avatar, title);
        this.renderFields();
        this.renderDropdowns();
        this.renderButtons();
    }
}

if (!customElements.get('settings-form')) {
    customElements.define('settings-form', UserSettingsForm, { extends: 'form' });
}