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
// import imageCompression from 'browser-image-compression';
// import { read } from 'fs';

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
        this.submitHandler = this.submitHandlerImplementation.bind(this);
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

    #fileToBinary(f: FormData): Promise<string | undefined> {
        console.log('in fetchHandler', f.get('upload'));
        const reader = new FileReader();
        const file = f.get('upload');
        if (!file || !(file instanceof File)) throw new Error('Error processing avatar');
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                const res = reader.result;
                if (typeof res === 'string') resolve(res);
                else resolve(undefined);
            };
            reader.onerror = () => {
                reject(reader.error);
            };
            reader.onabort = () => {
                reject(new DOMException('Aborted reading', 'AbortError'));
            };
            reader.readAsDataURL(file);
        });
    }

    /**
     * Handles the submit event for the form.
     * Appends color and language selections to the form data if changed.
     * @param ev - The submit event.
     */
    override async submitHandlerImplementation(ev: SubmitEvent) {
        ev.preventDefault();
        const f = new FormData(this);
        const colSelection = this.#colors.selectedElement;
        const langSelection = this.#languages.selectedElement;

        if (this.#user) {
            if (colSelection && 'bg-' + colSelection.id !== this.#user.profileColor)
                f.append('color', 'bg-' + colSelection.id);
            if (langSelection && langSelection.id !== this.#user.language)
                f.append('language', langSelection.id);
        }

        if (f.get('upload') && this.#user) {
            try {
                const binaryAvatar = await this.#fileToBinary(f);
				if (binaryAvatar) f.append('avatar', binaryAvatar);
            } catch (error) {
                console.error(error);
            }
        }
		f.delete('upload');
        const req = this.initReq();
        req.body = this.createReqBody(f);
        console.log(req.method, req.body);
        await this.sendForm(this.details.action, req);
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
        super.contentMap.get('title')?.classList.add('row-span-2');
        this.classList.add('sidebar-left');
    }
}

if (!customElements.get('settings-form')) {
    customElements.define('settings-form', UserSettingsForm, { extends: 'form' });
}
