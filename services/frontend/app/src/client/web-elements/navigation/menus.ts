import { createButton } from './buttons-helpers.js';
import type { ButtonData, ProfileView, DropdownBg } from '../types-interfaces.js';
import type { CustomButton } from './buttons.js';
import { Menu } from './basemenu.js';
import { errorMessageFromException, createVisualFeedback, exceptionFromResponse } from '../../error.js';
import { Listbox } from './listbox.js';
import { currentDictionary } from '../forms/language.js';

interface Relation {
	username: string;
}

/**
 * Represents a social menu with dynamic view state for user relationships.
 *
 * @remarks
 * Extends {@link Menu} and adapts UI based on {@link ProfileView} states:
 * - `friend` alters icon to remove user
 * - `stranger` alters icon to add user
 * - `self` hides the menu entirely
 */
export class SocialMenu extends Menu {
	#view: ProfileView;
	#owner: string;

	#APIRemoveFriend: (ev: Event) => void;
	#APIAddFriend: (ev: Event) => void;

	constructor() {
		super();
		this.id = 'social-menu';
		this.#view = 'stranger';
		this.#owner = '';
		this.#APIAddFriend = this.#APIAddFriendImplementation.bind(this);
		this.#APIRemoveFriend = this.#APIRemoveFriendImplementation.bind(this);
	}

	/**
	 * Sets the profile view and updates menu appearance.
	 *
	 * @param {ProfileView} v - The current profile relationship view.
	 */
	set view(v: ProfileView) {
		this.#view = v;
		this.render();
	}

	set owner(o: string) {
		this.#owner = o;
	}

	get owner(): string {
		return this.#owner;
	}

	async #APIRemoveFriendImplementation() {
		const url = `https://${API_URL}:8443/api/bff/relation`;
		const req: RequestInit = {
			method: 'delete',
			headers: { 'Content-Type': 'application/json' },
		};
		const profileOwner: Relation = { username: this.owner };
		req.body = JSON.stringify(profileOwner);
		try {
			const rawRes = await fetch(url, req);
			if (!rawRes.ok) throw await exceptionFromResponse(rawRes);
			this.view = 'stranger';
			this.updateView();
		} catch (error) {
			createVisualFeedback(errorMessageFromException(currentDictionary.error.something_wrong));
		}
	}

	async #APIAddFriendImplementation() {
		const url = `https://${API_URL}:8443/api/bff/relation`;
		const req: RequestInit = {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
		};
		const profileOwner: Relation = { username: this.owner };
		req.body = JSON.stringify(profileOwner);
		try {
			const rawRes = await fetch(url, req);
			if (!rawRes.ok) throw await exceptionFromResponse(rawRes);
			this.view = 'pending';
			this.updateView();
		} catch (error) {
			createVisualFeedback(errorMessageFromException(currentDictionary.error.something_wrong));
		}
	}
	/** Called when element connects to DOM; calls base and updates view. */
	override connectedCallback(): void {
		super.render();
		super.cache.get('removeFriend')?.addEventListener('click', this.#APIRemoveFriend);
		super.cache.get('addFriend')?.addEventListener('click', this.#APIAddFriend);
	}

	disconnectedCallback() {
		super.cache.get('removeFriend')?.removeEventListener('click', this.#APIRemoveFriend);
		super.cache.get('addFriend')?.removeEventListener('click', this.#APIAddFriend);
	}

	clearView() {
		super.cache.forEach((el) => {
			el.classList.add('hidden');
		});
	}

	pending() {
		super.cache.get('addFriend')?.classList.remove('hidden');
		super.cache.get('addFriend')?.setAttribute('disabled', '');
		super.cache.get('challenge')?.classList.remove('hidden');
	}

	friend() {
		super.cache.get('removeFriend')?.classList.remove('hidden');
		super.cache.get('challenge')?.classList.remove('hidden');
	}

	stranger() {
		super.cache.get('addFriend')?.classList.remove('hidden');
		super.cache.get('challenge')?.classList.remove('hidden');
	}

	/** Updates menu UI for 'self' view by hiding the menu. */
	self() {
		super.cache.get('settings')?.classList.remove('hidden');
	}

	/** Updates the menu appearance based on the current {@link ProfileView}. */
	updateView() {
		this.clearView();
		if (this.#view === 'friend') this.friend();
		else if (this.#view === 'stranger') this.stranger();
		else if (this.#view === 'self') this.self();
		else if (this.#view === 'pending') this.pending();
	}

	override render() {
		this.updateView();
	}
}

if (!customElements.get('social-menu')) {
	customElements.define('social-menu', SocialMenu, { extends: 'nav' });
}

export class DropdownMenu extends HTMLDivElement {
	/** Array of {@link ButtonData} used to fill the dropdown's option list*/
	#optionListData: ButtonData[];

	/** Array of {@link HTMLUListElement}, cached to manipulation the menu's option without querying the DOM everytime*/
	#dropdownStyle: DropdownBg;

	/** Inner components */
	/** A {@link CustomButton} which serves as the toggle to make the options appear */
	#toggle: CustomButton;

	/** A {@link HTMLUListElement} containing the `<li>` option of the menu */
	#listbox: Listbox;

	/* ----------------------------- event handlers ----------------------------- */
	// #keynavHandler: (ev: KeyboardEvent) => void;
	#navHandler: (ev: MouseEvent | KeyboardEvent) => void;
	#focusHandler: (ev: FocusEvent) => void;

	/* -------------------------------- defaults -------------------------------- */
	constructor() {
		super();
		this.#dropdownStyle = 'static';
		this.#optionListData = [];
		this.#listbox = document.createElement('ul', { is: 'list-box' }) as Listbox;
		this.#toggle = createButton({ id: '', type: 'button', content: '', img: null, ariaLabel: '' });
		this.#navHandler = this.#navImplementation.bind(this);
		this.#focusHandler = this.#handleFocusOut.bind(this);
	}

	connectedCallback() {
		this.#renderListbox();
		this.render();
		this.addEventListener('click', this.#navHandler);
		this.addEventListener('keydown', this.#navHandler);
		this.addEventListener('focusout', this.#focusHandler);
	}

	disconnectedCallback() {
		this.removeEventListener('click', this.#navHandler);
		this.removeEventListener('keydown', this.#navHandler);
		this.removeEventListener('focusout', this.#focusHandler);
	}

	/* ---------------------------- setters & getters --------------------------- */
	/**
	 * Sets inner property `#optionListData`
	 */
	set setOptions(data: ButtonData[]) {
		this.#optionListData = data;
	}

	/**
	 * Sets toggle's `textContent`
	 */
	set setToggleContent(content: string) {
		this.#toggle.textContent = content + ' \u25BE';
		this.#toggle.ariaHidden = 'true';
		this.ariaLabel = `Dropdown menu for ${content}`;
	}

	/**
	 * Toggles dynamic styling
	 */
	set setDropdownStyling(style: DropdownBg) {
		this.#dropdownStyle = style;
	}

	/**
	 * Getter for the menu's current selected element.
	 * @return `HTMLLiElement` if a selection was made, otherwise `null`.
	 */
	get selectedElement(): HTMLLIElement | null {
		for (let i = 0; i < this.#listbox.options.length; i++) {
			const option = this.#listbox.options[i];
			if (option && option.hasAttribute('selected')) return option;
		}
		return null;
	}

	/* ----------------------------- rendering logic ---------------------------- */
	render() {
		this.append(this.#toggle);
		this.append(this.#listbox);
		this.className = 'h-m w-thxl relative z-5';

		//TODO: add aria-controls on #toggle ?
		this.#toggle.ariaExpanded = 'false';
		this.#toggle.ariaHasPopup = 'listbox';
		this.#toggle.id = 'toggle';
		this.id = 'dropdown';
	}

	/**
	 * Renders the content of the listbox with the data contained in `this#optionListData`.
	 */
	#renderListbox() {
		this.#optionListData.forEach((option) => {
			const el = document.createElement('li');
			this.#listbox.append(el);
			if (option.content) {
				el.id = option.id;
				el.textContent = option.content;
				el.className =
					'brdr pad-xs flex justify-center items-center cursor-pointer \
					input-emphasis h-m';
				el.ariaLabel = option.ariaLabel;
				if (this.#dropdownStyle === 'static') el.classList.add('bg');
				else el.classList.add(`bg-${option.content}`, 'f-yellow');
			}
		});
		this.#listbox.arrayFromChildren();
	}

	/* ------------------------ navigation implementation ----------------------- */

	#updateToggle() {
		const selected = this.selectedElement;
		if (!selected) return 
		else if (this.#toggle.textContent !== selected.textContent + ' \u25BE') {
			this.#toggle.textContent = selected.textContent + ' \u25BE';
			if (this.#dropdownStyle === 'dynamic') this.#updateBackground(`bg-${selected.textContent}`);
			this.#listbox.collapse();
		}
	}

	/**
	 * Updates the toggle's background if the dropdown styling was set to dynamic.
	 * @param {string} newBg - The new background to add to the toggle.
	 */
	#updateBackground(newBg: string) {
		const bg: RegExpMatchArray | null = this.#toggle.className.match(/\bbg[\w-]*/g);
		if (!bg) {
			this.classList.add(newBg);
			return;
		}
		bg.forEach((oc) => {
			if (oc !== newBg) {
				this.#toggle.classList.remove(oc);
				this.#toggle.classList.add(newBg, 'f-yellow');
			}
		});
	}

	/**
	 * Collapses the options when the user tabs or clicks away from the dropdown and it looses focus.
	 * @param ev - The Focus Event
	 */
	#handleFocusOut(ev: FocusEvent) {
		const relTarget = ev.relatedTarget as HTMLElement | null;
		if (!relTarget || !this.contains(relTarget)) {
			this.#listbox.collapse();
		}
	}

	#handleKeyboardEvent(e: KeyboardEvent) {
		const keyActions: Record<string, () => void> = {
			Enter: () => this.#listbox?.expand(),
			Escape: () => this.#listbox?.collapse(),
			Space: () => this.#listbox?.expand(),
		};
		const action = keyActions[e.key];
		if (action) action();
	}

	#navImplementation(e: Event) {
		try {
			const target = e.target as Element | null;
			if (!target || !this.contains(target)) return;
			if (e instanceof KeyboardEvent) this.#handleKeyboardEvent(e);
			else {
				this.#listbox.hasAttribute('hidden') ? this.#listbox.expand() : this.#listbox.collapse();
			}
			this.#updateToggle();
		} catch (error) {
			console.error('Could not handle dropdown interaction', error);
		}
	}
}

if (!customElements.get('dropdown-menu')) {
	customElements.define('dropdown-menu', DropdownMenu, { extends: 'div' });
}
