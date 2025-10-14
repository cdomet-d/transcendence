import { tabBtn, tabGroup } from './buttons';
import type { TabMetadata } from '../../types-interfaces';

/**
 * Creates a tab panel extending HTMLDivElement.
 */
export class tabPanel extends HTMLDivElement {
    static get observedAttributes() {
        return ['selected'];
    }

    constructor() {
        super();
    }

    /**
     * Adds a CSS class name to the class list.
     *
     * @param {string} newClass - The class name to add.
     */
    updateClassList(newClass: string) {
        this.classList.add(newClass);
    }

    /**
     * Called when an observed attribute changes.
     *
     * @param {string} name - The attribute name that changed.
     * @param {string} oldValue - The old attribute value.
     * @param {string} newValue - The new attribute value.
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        let needsGrid: boolean = false;

        if (this.matches('[data-content="friends"]')) needsGrid = true;
        if (oldValue === newValue) return;
        if (name === 'selected') {
            if (this.hasAttribute('selected')) {
                this.classList.remove('hidden');
                needsGrid ? this.classList.add('masonery') : this.classList.add('block');
            } else {
                needsGrid ? this.classList.remove('masonery') : this.classList.remove('block');
                this.classList.add('hidden');
            }
        }
    }

    /**
     * Called when element is added to DOM.
     * Renders the initial class state.
     */
    connectedCallback() {
        this.render();
    }

    /**
     * Renders the panel's base classes and visibility.
     */
    render() {
        this.className = 'panel border-box overflow-scroll h-[100%] w-[inherit]';
        if (this.hasAttribute('selected')) {
            this.classList.add('block');
        } else {
            this.classList.add('hidden');
        }
    }
}

customElements.define('tab-panel', tabPanel, { extends: 'div' });

/**
 * Custom element extending HTMLDivElement to create a tab container.
 * Handles tab interactions, styling, and content toggling.
 *
 * @extends {HTMLDivElement}
 */
export class tabWrapper extends HTMLDivElement {
    #tabList: Array<TabMetadata>;

    constructor() {
        super();
        this.#tabList = [{ id: 'default', content: 'default', default: true }];
    }

    /**
     * Sets the list of tab metadata.
     * Throws if duplicate IDs are found.
     *
     * @param {Array<TabMetadata>} tabList
     */
    set tabList(tabList: Array<TabMetadata>) {
        this.#tabList = tabList;
        if (!this.isValidTabList(this.#tabList))
            throw new Error(
                'Duplicate Tab.data will lead to UI confusion. Check your TabInfo array.',
            );
    }

    /**
     * Attaches click event listener to handle tab selection.
     */
    attachEvent() {
        this.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as Element | null;

            if (target) {
                const tab: Element | null = target.closest('.tab');
                if (tab && this.contains(tab)) this.animateTab(tab);
            }
        });
    }

    /**
     * Called on element insertion into DOM.
     * Renders and attaches events.
     */
    connectedCallback() {
        this.render();
        this.attachEvent();
    }

    /**
     * Renders tab wrapper structure and adds tab buttons and panels.
     */
    render() {
        this.className =
            'clear-bg brdr w-[100%] overflow-hidden grid items-stretch grid-flow-row grid-cols-[1fr] grid-rows-[var(--s)_1fr]';
        this.appendChild(this.createTabButtons());
        this.createPanels();
    }

    /**
     * Validates uniqueness of tab IDs.
     *
     * @param {Array<TabMetadata>} tabList
     * @returns {boolean} True if no duplicates exist.
     */
    private isValidTabList(tabList: Array<TabMetadata>): boolean {
        return tabList.every((item, i, self) => i === self.findIndex((t) => t.id === item.id));
    }

    /**
     * Handles activating the clicked tab and corresponding panel.
     *
     * @param {Element} tab - The tab element clicked.
     */
    private animateTab(tab: Element) {
        const tabs = this.querySelectorAll('.tab');
        const panels = this.querySelectorAll('.panel');

        tabs.forEach((t) => t.removeAttribute('selected'));
        panels.forEach((p) => p.removeAttribute('selected'));
        tab.setAttribute('selected', '');

        const clickedTab = tab.getAttribute('data-tab');
        const activeTab = this.querySelector(`.panel[data-content="${clickedTab}"]`);
        activeTab?.setAttribute('selected', '');
    }

    /**
     * Creates the tab buttons container element.
     *
     * @returns {HTMLDivElement} The container for tab buttons.
     */
    private createTabButtons(): HTMLDivElement {
        let isSet: boolean = false;
        const tabHeader = document.createElement('div', { is: 'tab-group' }) as tabGroup;

        this.#tabList.forEach((tab) => {
            const el = document.createElement('button', { is: 'tab-button' }) as tabBtn;
            el.setAttribute('data-tab', tab.id);
            el.textContent = tab.content;
            if (tab.default && !isSet) {
                isSet = true;
                el.setAttribute('selected', '');
            }
            tabHeader.appendChild(el);
        });
        return tabHeader;
    }

    /**
     * Creates content panels matching tabs.
     */
    private createPanels() {
        let isSet: boolean = false;
        this.#tabList.forEach((tab) => {
            const el = document.createElement('div', { is: 'tab-panel' }) as tabPanel;
            el.setAttribute('data-content', tab.id);
            el.textContent = tab.content;
            if (tab.default && !isSet) {
                isSet = true;
                el.setAttribute('selected', '');
            }
            this.appendChild(el);
        });
    }
}

customElements.define('tab-wrapper', tabWrapper, { extends: 'div' });
