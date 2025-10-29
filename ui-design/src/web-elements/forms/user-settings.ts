import { BaseForm } from './baseform';
import { createAvatar } from '../typography/helpers';
import { createDropdown } from '../navigation/menu-helpers';
import { user, userColorsMenu, languageMenu } from '../../default-values';

import type { DropdownMenu } from '../navigation/menus';
import type { UserData } from '../../types-interfaces';
import type { Avatar } from '../typography/images';

export class UserSettingsForm extends BaseForm {
    #user: UserData;
    #colors: DropdownMenu;
    #languages: DropdownMenu;
    #avatar: Avatar;

    constructor() {
        super();
        this.#user = user;
        this.#avatar = createAvatar(this.#user.avatar);
        this.#colors = createDropdown(userColorsMenu, 'Pick color', 'dynamic');
        this.#languages = createDropdown(languageMenu, 'Pick language', 'static');
    }

    set user(details: UserData) {
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
        dropdownWrapper.className = 'grid gap-s grid-flow-col row-start-6';
        this.append(dropdownWrapper);
    }

    override render() {
        this.append(this.#avatar);
		super.renderTitle();
		super.renderFields();
        this.renderDropdowns();
		super.renderButtons();
		this.#avatar.classList.add('row-span-2');
		super.contentMap['biography'].classList.add('col-start-1', 'row-span-3', 'place-self-stretch')
		super.contentMap['title'].classList.add('row-span-2')
        this.classList.add('sidebar-left');
    }
}

if (!customElements.get('settings-form')) {
    customElements.define('settings-form', UserSettingsForm, { extends: 'form' });
}
