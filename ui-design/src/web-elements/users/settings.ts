import { BaseForm } from '../inputs/forms';
import { createAvatar, createHeading } from '../typography/helpers';
import { createDropdown } from '../navigation/helpers';
import * as defaults from '../../default-values';
import * as types from '../../types-interfaces';
import type { Avatar } from '../typography/images';
import type { DropdownMenu } from '../navigation/menus';

export class UserSettingsForm extends BaseForm {
    #user: types.UserData;
    #colors: DropdownMenu;
    #languages: DropdownMenu;
    #avatar: Avatar;

    constructor() {
        super();
        this.#user = defaults.user;
        this.#avatar = createAvatar(this.#user.avatar);
        this.#colors = createDropdown(defaults.userColorsMenu, 'Pick color', 'dynamic');
        this.#languages = createDropdown(defaults.languageMenu, 'Pick language', 'static');
    }

    set user(details: types.UserData) {
        this.#user = details;
    }

    override submitHandler(ev: SubmitEvent) {
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

    renderDropdowns() {
        const dropdownWrapper = document.createElement('div');
        dropdownWrapper.append(this.#colors, this.#languages);
        dropdownWrapper.className = 'grid gap-s grid-flow-col z-1';
        this.append(dropdownWrapper);
    }

    override render() {
        const title = createHeading('1', 'Settings');
        this.append(this.#avatar, title);
        this.renderFields();
        this.renderDropdowns();
        this.renderButtons();
        this.classList.add('sidebar-left');
    }
}

if (!customElements.get('settings-form')) {
    customElements.define('settings-form', UserSettingsForm, { extends: 'form' });
}
