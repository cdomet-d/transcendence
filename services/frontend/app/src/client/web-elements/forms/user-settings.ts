import { BaseForm } from './baseform.js';
import { createAvatar } from '../typography/helpers.js';
import { createDropdown } from '../navigation/menu-helpers.js';
import { createForm } from './helpers.js';
import { deleteAccount } from './default-forms.js';
import { user } from '../default-values.js';
import { userColorsMenu, languageMenu } from '../navigation/default-menus.js';
import type { Avatar } from '../typography/images.js';
import type { DropdownMenu } from '../navigation/menus.js';
import type { UserData } from '../types-interfaces.js';
/**
 * Custom form element for user settings, including avatar, color, language, and account deletion.
 * Extends BaseForm.
 */
export class UserSettingsForm extends BaseForm {
    #user: UserData;
    #accountDelete: BaseForm;
    #colors: DropdownMenu;
    #languages: DropdownMenu;
    #avatar: Avatar;

    /**
     * Initializes the user settings form with user data, avatar, color and language dropdowns, and account deletion form.
     */
    constructor() {
        super();
        this.#user = user;
        this.#accountDelete = createForm('default-form', deleteAccount);
        this.#avatar = createAvatar(this.#user.avatar);
        this.#colors = createDropdown(userColorsMenu, 'Pick color', 'dynamic');
        this.#languages = createDropdown(languageMenu, 'Pick language', 'static');
    }

    /**
     * Sets the user data for the form.
     * @param details - The user data object.
     */
    set user(details: UserData) {
        this.#user = details;
    }

    /**
     * Handles the submit event for the form.
     * Appends color and language selections to the form data if changed.
     * @param ev - The submit event.
     */
    override async submitHandler(ev: SubmitEvent) {
        ev.preventDefault();
        const f = new FormData(this);
        const colSelection = this.#colors.selectedElement;
        const langSelection = this.#languages.selectedElement;
        console.log(this.#user);
        if (this.#user) {
            console.log('user is defined');
            if (colSelection && 'bg-' + colSelection.id !== this.#user.profileColor)
                f.append('color', 'bg-' + colSelection.id);
            if (langSelection && langSelection.id !== this.#user.language)
                f.append('language', langSelection.id);
        }
        const data = await this.sendForm(this.details.action, this.details.method, f);
        console.log(data);
    }

    /**
     * Renders the color and language dropdown menus.
     */
    renderDropdowns() {
        const dropdownWrapper = document.createElement('div');
        dropdownWrapper.append(this.#colors, this.#languages);
        dropdownWrapper.className = 'grid gap-s grid-flow-col';
        this.append(dropdownWrapper);
    }

    /**
     * Renders the user settings form, including avatar, title, fields, dropdowns, buttons, and account deletion form.
     * Applies custom styles to certain fields.
     */
    override render() {
        this.append(this.#avatar);
        super.renderTitle();
        super.renderFields();
        this.renderDropdowns();
        super.renderButtons();
        this.append(this.#accountDelete);
        this.#avatar.classList.add('row-span-2');
        super.contentMap['title']?.classList.add('row-span-2');
        this.classList.add('sidebar-left');
    }
}

if (!customElements.get('settings-form')) {
    customElements.define('settings-form', UserSettingsForm, { extends: 'form' });
}
