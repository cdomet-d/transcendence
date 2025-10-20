import { createBtn } from './helpers';
import type { buttonData, MenuStyle, ProfileView, MenuSize } from '../../types-interfaces';
import type { Icon } from '../typography/images';

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
    #options: buttonData[];
    #listbox: HTMLUListElement;

    constructor() {
        super();
        this.#options = [];
        this.#listbox = document.createElement('ul');
    }

    set setOptions(options: buttonData[]) {
        this.#options = options;
    }

    renderListbox() {
        this.#options.forEach((option) => {
            const el = document.createElement('li');
            this.#listbox.append(el);
            if (option.content) {
                el.id = option.content;
                el.textContent = option.content;
                el.classList.add(
                    `bg-${option.content}`,
					// 'brdr',
					// 'thin',
                    'pad-s',
                    'f-yellow',
                    'flex',
                    'justify-center',
                );
                el.role = 'option';
                el.ariaSelected = 'false';
                el.setAttribute('tabindex', '-1');
            }
        });
    }
    connectedCallback() {
        this.renderListbox();
        this.render();
        let focusedIndex: number = -1;
        this.addEventListener('keydown', (event) => {
            const options = Array.from(this.#listbox.children) as HTMLLIElement[];
            if (event.key === 'ArrowDown') {
                focusedIndex = (focusedIndex + 1) % options.length;
                options[focusedIndex]?.focus();
                event.preventDefault();
            } else if (event.key === 'ArrowUp') {
                focusedIndex = (focusedIndex - 1 + options.length) % options.length;
                options[focusedIndex]?.focus();
                event.preventDefault();
            }
        });
    }

    render() {
        this.#listbox.role = 'listbox';
        const ddbtn = createBtn({
            type: 'button',
            content: 'Pick a color !',
            img: null,
            ariaLabel: 'Dropdown menu',
        });
        this.append(ddbtn);
        this.append(this.#listbox);
        this.id = 'dropdown';
        this.className = 'w-l h-m';
    }
}

if (!customElements.get('dropdown-menu')) {
    customElements.define('dropdown-menu', DropdownMenu, { extends: 'div' });
}
