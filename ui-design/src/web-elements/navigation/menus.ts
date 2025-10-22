import { createBtn } from './helpers';
import type {
    buttonData,
    MenuStyle,
    ProfileView,
    MenuSize,
    DropdownBg,
} from '../../types-interfaces';
import type { Icon } from '../typography/images';
import type { CustomButton } from './buttons';

/**
 * Custom HTML div element representing a menu with configurable style and elements.
 *
 * @remarks
 * The menu supports two styles: 'horizontal' and 'vertical', which control the grid layout direction.
 * It supports both icon and textual buttons.
 * Menu elements are configured using {@link buttonData} and created via {@link createBtn}.
 */
export class Menu extends HTMLDivElement {
    #size: MenuSize;
    #animated: boolean;
    #style: MenuStyle;
    #elements: Array<buttonData>;

    constructor() {
        super();
        this.#elements = [];
        this.#style = 'horizontal';
        this.#size = 'm';
        this.#animated = false;
    }

    /**
     * Sets the menu's button elements.
     *
     * @param {Array<buttonData>} list - Array of buttonData for menu buttons.
     */
    set MenuElements(list: Array<buttonData>) {
        this.#elements = list;
    }

    /**
     * Sets the menu's layout style.
     *
     * @param {MenuStyle} style - MenuStyle, either 'horizontal' or 'vertical'.
     */
    set MenuStyle(style: MenuStyle) {
        this.#style = style;
    }

    /**
     * Sets the menu's size variant.
     *
     * @param {MenuSize} size - Menu size, e.g., 'm' or 'l'.
     */
    set MenuSize(size: MenuSize) {
        this.#size = size;
    }

    /**
     * Enables or disables animation for menu buttons.
     *
     * @param {boolean} b - True to enable animations, false otherwise.
     */
    set animation(b: boolean) {
        this.#animated = b;
    }

    /** Called when the element is inserted into the DOM; triggers rendering. */
    connectedCallback() {
        this.render();
    }

    /**
     * Renders the menu layout and appends button elements.
     *
     * @remarks
     * Uses CSS grid classes according to style and size settings.
     * Button elements are created using the {@link createBtn} helper with animation option.
     */
    render() {
        this.role = 'navigation';
        this.id = 'menu';
        this.className = `gap-s box-border grid justify-items-center auto-cols-fr row-${
            this.#size
        }`;
        if (this.#style === 'horizontal') this.classList.add('grid-flow-col');
        if (this.#style === 'vertical') this.classList.add('grid-flow-rows');
        this.#elements.forEach((item) => this.appendChild(createBtn(item, this.#animated)));
    }
}

if (!customElements.get('menu-wrapper')) {
    customElements.define('menu-wrapper', Menu, { extends: 'div' });
}

//TODO: update SocialMenu to Setting button when view is 'self'
//TODO: is the UI update as smooth as it could be ?

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

    constructor() {
        super();
        this.#view = 'stranger';
    }

    /**
     * Sets the profile view and updates menu appearance.
     *
     * @param {ProfileView} v - The current profile relationship view.
     */
    set view(v: ProfileView) {
        this.#view = v;
        this.updateView();
    }

    /** Called when element connects to DOM; calls base and updates view. */
    override connectedCallback(): void {
        super.connectedCallback();
        this.updateView();
    }

    /**
     * Updates menu UI for 'friend' profile view.
     *
     * @param {Icon} icon - The icon element to update.
     */
    friend(icon: Icon) {
        this.classList.remove('hidden');
        icon.src = '/assets/icons/remove-user.png';
    }

    /**
     * Updates menu UI for 'stranger' profile view.
     *
     * @param {Icon} icon - The icon element to update.
     */
    stranger(icon: Icon) {
        this.classList.remove('hidden');
        icon.src = '/assets/icons/add-user.png';
    }

    /** Updates menu UI for 'self' view by hiding the menu. */
    self() {
        this.classList.add('hidden');
    }

    /** Updates the menu appearance based on the current {@link ProfileView}. */
    updateView() {
        this.id = 'social-menu';
        const icon = this.querySelector('#friendship') as Icon;
        if (!icon) return;

        if (this.#view === 'friend') this.friend(icon);
        else if (this.#view === 'stranger') this.stranger(icon);
        else if (this.#view === 'self') this.self();
    }
}

if (!customElements.get('social-menu')) {
    customElements.define('social-menu', SocialMenu, { extends: 'div' });
}

export class DropdownMenu extends HTMLDivElement {
    /** Array of {@link buttonData} used to fill the dropdown's option list*/
    #optionListData: buttonData[];

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
    /** Index to the currently focused option in the listbox */
    #currentFocus: number;

    constructor() {
        super();
        this.#dropdownStyle = 'static';
        this.#optionListData = [];
        this.#listboxOptions = [];
        this.#listbox = document.createElement('ul');
		//TODO: set user selected preference on first load
        this.#toggle = createBtn({
            type: 'button',
            content: '',
            img: null,
            ariaLabel: 'Dropdown menu',
        });
        this.#currentFocus = -1;
        this.#keynavHandler = this.keyboardNavHandler.bind(this);
        this.#mouseNavHandler = this.mouseNavHandler.bind(this);
    }

    /**
     * Sets inner property `#optionListData`
     */
    set setOptions(data: buttonData[]) {
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

    get selectedElement(): HTMLLIElement | null {
        console.log(this.#listboxOptions);
        for (let i = 0; i < this.#listboxOptions.length; i++) {
            if (this.#listboxOptions[i].hasAttribute('selected')) return this.#listboxOptions[i];
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
                    'brdr pad-s flex justify-center items-center cursor-pointer input-emphasis h-m w-l';
                el.role = 'option';
                el.ariaSelected = 'false';
                el.setAttribute('tabindex', '-1');
                if (this.#dropdownStyle === 'static') el.classList.add('bg');
                else el.classList.add(`bg-${option.content}`, 'f-yellow');
            }
        });
        this.#listbox.className = 'hidden absolute';
        this.#listboxOptions = Array.from(this.#listbox.children) as HTMLLIElement[];
    }

    /**
     * Updates the focus on the list element if the user is navigating using the keyboard.
     */
    #selectOptKeyboard() {
        this.#listboxOptions[this.#currentFocus].ariaSelected = 'true';
        this.#listboxOptions[this.#currentFocus].setAttribute('selected', '');
    }

    /**
     * Updates focus on the list element if the user is navigating using the mouse.
     * @param {HTMLElement} t - the target of the mouseEvent.
     */
    #selectOptOnClick(t: HTMLElement) {
        if (t.tagName === 'LI') {
            t.ariaSelected = 'true';
            t.setAttribute('selected', '');
        }
    }

    /**
     * Targets dropdown menu and updates the active element representing the user's choice.
     * It sets the attribute `selected` on the user's choice, then updates the toggle's content with the selected option.
     * @param {HTMLElement} [target] - optionnal. Allows `#updateSelection()` to be called both by the `'click'` handler, which passes a target, and by the `'keydown'` handler, that updates the internal property `this.#currentFocus`
     */
    #updateSelection(target?: HTMLElement) {
        this.#listboxOptions.forEach((li) => {
            li.removeAttribute('selected');
            li.ariaSelected = 'false';
        });

        if (this.#currentFocus >= 0) this.#selectOptKeyboard();
        else if (target) this.#selectOptOnClick(target);

        this.#listboxOptions.forEach((el) => {
            if (el.hasAttribute('selected')) {
                this.#toggle.textContent = el.textContent + ' \u25BE';

                if (this.#dropdownStyle === 'dynamic') {
                    if (el.textContent === 'Default') this.#updateBackground('bg');
                    else this.#updateBackground(`bg-${el.textContent}`);
                }
            }
        });
        this.#listbox.classList.toggle('hidden');
    }

    /**
     * Used by the `'keydown'` handler to calculate where the user is in the menu's option, remaining within the bounds of the options.
     * @param {number} delta - the incrementing step; it's worth `-1` on `ArrowUp` and `1` on `ArrowDown`
     */
    #moveFocus(delta: number) {
        this.#currentFocus =
            (this.#currentFocus + delta + this.#listboxOptions.length) %
            this.#listboxOptions.length;
        this.#listboxOptions[this.#currentFocus].focus();
    }

    /**
     * Handles keyboard navigation.
     * @param {KeyboardEvent} ev - the event send by `addEventListener`
     */
    keyboardNavHandler(ev: KeyboardEvent) {
        //TODO: handle closing on ESC
        //TODO: move focus on first item on open
        //TODO: aria role for open/closed
        const actions: { [key: string]: () => void } = {
            ArrowDown: () => this.#moveFocus(1),
            ArrowUp: () => this.#moveFocus(-1),
            Enter: () => this.#updateSelection(),
        };

        if (actions[ev.key]) {
            ev.preventDefault();
            actions[ev.key]();
        }
    }

    /**
     * Handles mouse navigation.
     * @param {MouseEvent} ev - the event send by `addEventListener`
     */
    mouseNavHandler(ev: MouseEvent) {
        const target = ev.target as HTMLButtonElement;
        this.#updateSelection(target);
    }

    connectedCallback() {
        this.#renderListbox();
        this.render();
        this.addEventListener('keydown', (ev) => this.#keynavHandler(ev));
        this.addEventListener('click', (ev) => this.#mouseNavHandler(ev));
    }

    disconnectedCallback() {
        this.removeEventListener('keydown', (ev) => this.#keynavHandler(ev));
        this.removeEventListener('click', (ev) => this.#mouseNavHandler(ev));
    }

    render() {
        this.append(this.#toggle);
        this.append(this.#listbox);
        this.#listbox.role = 'listbox';
        this.id = 'dropdown';
        this.role = 'menu';
        this.className = 'h-m w-l relative';
    }
}

if (!customElements.get('dropdown-menu')) {
    customElements.define('dropdown-menu', DropdownMenu, { extends: 'div' });
}
