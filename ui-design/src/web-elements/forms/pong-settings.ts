import { createDropdown } from '../navigation/menu-helpers';
import { DropdownMenu } from '../navigation/menus';
import { BaseForm } from './baseform';
import { backgroundMenu } from '../../default-values';
import { createHeading } from '../typography/helpers';
// import type { Searchbar } from "./search";

export class LocalPongSettings extends BaseForm {
    #backgroundSelector: DropdownMenu;

    constructor() {
        super();
        this.#backgroundSelector = createDropdown(backgroundMenu, 'Select background', 'static');
    }

	override render() {
		const title = createHeading('1', super.details.heading);
	
		this.append(title);
		this.append(this.#backgroundSelector);
		this.renderFields();
		this.renderButtons();
	}
}

if (!customElements.get('local-pong-settings')) {
	customElements.define('local-pong-settings', LocalPongSettings, { extends: 'form' });
}
