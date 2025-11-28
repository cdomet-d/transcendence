import { createButton } from './buttons-helpers.js';
import type { ButtonData, ProfileView, DropdownBg } from '../types-interfaces.js';
import type { CustomButton } from './buttons.js';
import { Menu } from './basemenu.js';
import { errorMessageFromException, createErrorFeedback, errorMessageFromResponse } from '../../error.js';

//TODO: update SocialMenu to Setting button when view is 'self'
//TODO: each button is actually a form, lol
//TODO: is the UI update as smooth as it could be ?

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

	// TODO: RemoveFriends is calling correctly but results in 404 = unsure whether there's a true issue 
	// or if it's because the current friendships are artificially created.
    async #APIRemoveFriendImplementation() {
        console.log('RemoveFriends');
        const url = 'https://localhost:8443/api/bff/relation';
        const req: RequestInit = {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
        };
        const profileOwner: Relation = { username: this.owner };
        req.body = JSON.stringify(profileOwner);
        try {
            const rawRes = await fetch(url, req);
			if (!rawRes.ok) throw await errorMessageFromResponse(rawRes)
            this.view = 'stranger';
            this.updateView();
        } catch (error) {
			createErrorFeedback(errorMessageFromException(error));
        }
    }

    async #APIAddFriendImplementation() {
        console.log('AddFriends');
        const url = 'https://localhost:8443/api/bff/relation';
        const req: RequestInit = {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
        };
        const profileOwner: Relation = { username: this.owner };
        req.body = JSON.stringify(profileOwner);
        try {
            const rawRes = await fetch(url, req);
			if (!rawRes.ok) throw await errorMessageFromResponse(rawRes)
            this.view = 'pending';
            this.updateView();
        } catch (error) {
			createErrorFeedback(errorMessageFromException(error));
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
    #listboxOptions: HTMLLIElement[];
    #dropdownStyle: DropdownBg;

    /** Inner components */
    /** A {@link CustomButton} which serves as the toggle to make the options appear */
    #toggle: CustomButton;

    /** A {@link HTMLUListElement} containing the `<li>` option of the menu */
    #listbox: HTMLUListElement;

    /** Event handling */
    #keynavHandler: (ev: KeyboardEvent) => void;
    #mouseNavHandler: (ev: MouseEvent) => void;
    #focusHandler: (ev: FocusEvent) => void;
    /** Index to the currently focused option in the listbox */
    #currentFocus: number;

    constructor() {
        super();
        this.#dropdownStyle = 'static';
        this.#optionListData = [];
        this.#listboxOptions = [];
        this.#listbox = document.createElement('ul');
        this.#toggle = createButton({
            id: '',
            type: 'button',
            content: '',
            img: null,
            ariaLabel: '',
        });
        this.#currentFocus = -1;
        this.#keynavHandler = this.keyboardNavHandler.bind(this);
        this.#mouseNavHandler = this.mouseNavHandler.bind(this);
        this.#focusHandler = this.#handleFocusOut.bind(this);
    }

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
        for (let i = 0; i < this.#listboxOptions.length; i++) {
            const option = this.#listboxOptions[i];
            if (option && option.hasAttribute('selected')) return option;
        }
        return null;
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
     * Renders the content of the listbox with the data contained in `this#optionListData`.
     */
    #renderListbox() {
        this.#optionListData.forEach((option) => {
            const el = document.createElement('li');
            this.#listbox.append(el);
            if (option.content) {
                el.id = option.content;
                el.textContent = option.content;
                el.className =
                    'brdr pad-xs flex justify-center items-center cursor-pointer input-emphasis h-m';
                el.role = 'option';
                el.ariaSelected = 'false';
                el.setAttribute('tabindex', '-1');
                if (this.#dropdownStyle === 'static') el.classList.add('bg');
                else el.classList.add(`bg-${option.content}`, 'f-yellow');
            }
        });
        this.#listbox.role = 'listbox';
        this.#listbox.setAttribute('hidden', '');
        this.#listbox.className = 'hidden z-0';
        this.#listboxOptions = Array.from(this.#listbox.children) as HTMLLIElement[];
    }

    /**
     * Updates focus on the currently active option. Used to provide visual feedback.
     * @param {HTMLElement} t - the target of the mouseEvent.
     */
    #selectOption(t: HTMLElement) {
        t.ariaSelected = 'true';
        t.setAttribute('selected', '');
    }

    #clearSelection(li: HTMLLIElement) {
        li.removeAttribute('selected');
        li.ariaSelected = 'false';
    }

    /** Reveals the listbox popup and sets the focus back on either the first element or the current selection */
    #expandOptions(isKeyboard: boolean) {
        this.#listbox.classList.remove('hidden');
        this.#toggle.ariaExpanded = 'true';
        this.#listbox.removeAttribute('hidden');
        if (this.#currentFocus === -1 && isKeyboard) this.#moveFocus(1);
        else if (this.#currentFocus !== -1) {
            const focusedOption = this.#listboxOptions[this.#currentFocus];
            if (focusedOption) focusedOption.focus();
        }
    }

    //TODO: make the toggle focus only on keyboard navigation.
    /** Hides the listbox popup and sets the focus back on toggle */
    #collapseOptions() {
        if (this.#listbox.hasAttribute('hidden')) return;
        else {
            this.#listbox.classList.add('hidden');
            this.#toggle.ariaExpanded = 'false';
            this.#listbox.setAttribute('hidden', '');
        }
        this.#toggle.focus();
    }

    /**
     * Targets dropdown menu and updates the active element representing the user's choice.
     * It sets the attribute `selected` on the user's choice, then updates the toggle's content with the selected option.
     * @param {HTMLElement} [target] - optionnal. Allows `#updateSelection()` to be called both by the `'click'` handler, which passes a target, and by the `'keydown'` handler, that updates the internal property `this.#currentFocus`
     */
    #updateSelection(target: HTMLElement) {
        if (target.tagName === 'LI') {
            this.#listboxOptions.forEach((li) => this.#clearSelection(li));
            this.#selectOption(target);
            this.#listboxOptions.forEach((el) => {
                if (el.hasAttribute('selected')) {
                    this.#toggle.textContent = el.textContent + ' \u25BE';
                    if (this.#dropdownStyle === 'dynamic')
                        this.#updateBackground(`bg-${el.textContent}`);
                }
            });
            this.#collapseOptions();
        }
    }

    /**
     * Used by the `'keydown'` handler to calculate where the user is in the menu's option, remaining within the bounds of the options.
     * @param {number} delta - the incrementing step; it's worth `-1` on `ArrowUp` and `1` on `ArrowDown`
     */
    #moveFocus(delta: number) {
        this.#currentFocus =
            (this.#currentFocus + delta + this.#listboxOptions.length) %
            this.#listboxOptions.length;
        const focusedOption = this.#listboxOptions[this.#currentFocus];
        if (focusedOption) focusedOption.focus();
    }

    /**
     * Collapses the options when the user tabs or clicks away from the dropdown and it looses focus.
     * @param ev - The Focus Event
     */
    #handleFocusOut(ev: FocusEvent) {
        const relTarget = ev.relatedTarget as HTMLElement | null;
        if (!relTarget || !this.contains(relTarget)) {
            this.#collapseOptions();
        }
    }

    /**
     * Handles keyboard navigation.
     * @param {KeyboardEvent} ev - the event send by `addEventListener`
     */
    keyboardNavHandler(ev: KeyboardEvent) {
        const target = ev.target as HTMLElement;
        const actions: { [key: string]: () => void } = {
            ArrowDown: () => this.#moveFocus(1),
            ArrowUp: () => this.#moveFocus(-1),
            Enter: () => this.#updateSelection(target),
            Escape: () => this.#collapseOptions(),
        };

        if (actions[ev.key]) {
            ev.preventDefault();
            if (target.tagName === 'BUTTON' && ev.key == 'Enter') this.#expandOptions(true);
            else actions[ev.key]!();
        }
    }

    /**
     * Handles mouse navigation.
     * @param {MouseEvent} ev - the event send by `addEventListener`
     */
    mouseNavHandler(ev: MouseEvent) {
        const target = ev.target as HTMLButtonElement;
        if (target.tagName === 'BUTTON') {
            this.#listbox.hasAttribute('hidden')
                ? this.#expandOptions(false)
                : this.#collapseOptions();
        } else this.#updateSelection(target);
    }

    connectedCallback() {
        this.#renderListbox();
        this.render();
        this.addEventListener('keydown', this.#keynavHandler);
        this.addEventListener('click', this.#mouseNavHandler);
        this.addEventListener('focusout', this.#focusHandler);
    }

    disconnectedCallback() {
        this.removeEventListener('keydown', this.#keynavHandler);
        this.removeEventListener('click', this.#mouseNavHandler);
        this.removeEventListener('focusout', this.#focusHandler);
    }

    render() {
        this.append(this.#toggle);
        this.append(this.#listbox);
        this.className = 'h-m  relative z-1';

        //TODO: add aria-controls on #toggle ?
        this.#toggle.ariaExpanded = 'false';
        this.#toggle.ariaHasPopup = 'listbox';
        this.#toggle.ariaLabel = `Dropdown menu for ${this.#toggle.textContent}`;
        this.#toggle.id = 'toggle';
        this.id = 'dropdown';
    }
}

if (!customElements.get('dropdown-menu')) {
    customElements.define('dropdown-menu', DropdownMenu, { extends: 'div' });
}
