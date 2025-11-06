import { createMatchHistory } from '../matches/matches.js';
import { createUserMasonery } from './tabs-helpers.js';
import { MatchHistory } from '../matches/matches.js';
import { TabButton, TabButtonWrapper } from './buttons.js';
import { UserMasonery } from '../users/user-profile-containers.js';
import type { MatchOutcome, TabData, UserData } from '../types-interfaces.js';
import { createNoResult } from '../typography/helpers.js';

/**
 * Creates a tab panel extending HTMLDivElement.
 */
export class TabPanel extends HTMLDivElement {
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
     * Replaces the current content of the tab panel with the provided element.
     *
     * @param innerContent - The HTMLElement to append as the new content of the panel.
     */
    appendContent(innerContent: HTMLElement) {
        while (this.firstChild) this.removeChild(this.firstChild);
        this.append(innerContent);
    }

    /**
     * Called when an observed attribute changes.
     *
     * @param {string} name - The attribute name that changed.
     * @param {string} oldValue - The old attribute value.
     * @param {string} newValue - The new attribute value.
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;
        if (name === 'selected') {
            if (this.hasAttribute('selected')) {
                this.classList.remove('hidden');
                this.removeAttribute('hidden');
            } else {
                this.classList.add('hidden');
                this.setAttribute('hidden', '');
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
        this.className = 'panel box-border overflow-y-scroll overflow-x-hidden h-full w-full';
        if (this.hasAttribute('selected')) {
            this.classList.add('block');
        } else {
            this.setAttribute('hidden', '');
            this.classList.add('hidden');
        }
    }
}

if (!customElements.get('tab-panel')) {
    customElements.define('tab-panel', TabPanel, { extends: 'div' });
}

/**
 * Custom element extending HTMLDivElement to create a tab container.
 * Handles tab interactions, styling, and content toggling.
 *
 * @extends {HTMLDivElement}
 */
export class TabContainer extends HTMLDivElement {
    #tabList: TabData[];
    #tabPanels: { [key: string]: TabPanel };
    #tabHeaders: { [key: string]: TabButton };

    constructor() {
        super();
        this.#tabList = [{ id: 'default', content: 'default', default: true, panelContent: [] }];
        this.#tabPanels = {};
        this.#tabHeaders = {};
    }

    /**
     * Sets the list of tab metadata.
     * Throws if duplicate IDs are found.
     *
     * @param {TabData[]} tabList
     */
    set tabList(tabList: TabData[]) {
        this.#tabList = tabList;
        if (!this.#isValidTabList(this.#tabList))
            throw new Error(
                'Duplicate Tab.data will lead to UI confusion. Check your TabInfo array.',
            );
    }

    /**
     * Attaches click event listener to handle tab selection.
     */
    //TODO: add disconnected callback
    attachEvent() {
        this.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as Element | null;

            if (target) {
                const tab: Element | null = target.closest('.tab');
                if (tab && this.contains(tab)) this.#animateTab(tab);
            }
        });
    }

    /**
     * Handles activating the clicked tab and corresponding panel.
     *
     * @param {Element} tab - The tab element clicked.
     */
    #animateTab(tab: Element) {
        for (const key in this.#tabHeaders) {
            this.#tabHeaders[key]!.removeAttribute('selected');
        }
        for (const key in this.#tabPanels) {
            this.#tabPanels[key]!.removeAttribute('selected');
        }

        tab.setAttribute('selected', '');
        const clickedTab = tab.getAttribute('data-tab');
        if (clickedTab) this.#tabPanels[clickedTab]!.setAttribute('selected', '');
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
     * Validates uniqueness of tab IDs.
     *
     * @param {TabData[]} tabList
     * @returns {boolean} True if no duplicates exist.
     */
    #isValidTabList(tabList: TabData[]): boolean {
        return tabList.every((item, i, self) => i === self.findIndex((t) => t.id === item.id));
    }
    /**
     * Creates the tab buttons container element.
     *
     * @returns {HTMLDivElement} The container for tab buttons.
     */
    #createTabButtons(): TabButtonWrapper {
        let isSet: boolean = false;
        const tabHeader = document.createElement('div', {
            is: 'tab-button-wrapper',
        }) as TabButtonWrapper;

        this.#tabList.forEach((tab) => {
            const el = document.createElement('button', { is: 'tab-button' }) as TabButton;
            this.#tabHeaders[tab.id] = el;
            el.setAttribute('data-tab', tab.id);
            el.textContent = tab.content;
            if (tab.default && !isSet) {
                isSet = true;
                el.setAttribute('selected', '');
            }
            tabHeader.append(el);
        });
        return tabHeader;
    }

    /**
     * Creates content panels matching tabs.
     */
    #createPanels() {
        let isSet: boolean = false;
        this.#tabList.forEach((tab) => {
            const el = document.createElement('div', { is: 'tab-panel' }) as TabPanel;
            this.#tabPanels[tab.id] = el;
            el.setAttribute('data-content', tab.id);
            el.textContent = tab.content;
            if (tab.default && !isSet) {
                isSet = true;
                el.setAttribute('selected', '');
            }
            this.append(el);
            el.classList.add('pad-xs');
            this.populatePanels(tab, el);
        });
    }

    populatePanels(tab: TabData, el?: TabPanel) {
        if (tab.panelContent.length > 0) {
            if (tab.id === 'history')
                this.#tabPanels[tab.id]?.appendContent(
                    createMatchHistory(tab.panelContent as MatchOutcome[]) as MatchHistory,
                );
            else if (tab.id === 'friends')
                this.#tabPanels[tab.id]?.appendContent(
                    createUserMasonery(tab.panelContent as UserData[]) as UserMasonery,
                );
        } else {
            if (el) el.appendContent(createNoResult('light', 'ifs'));
            else console.log('No such tab - do better');
        }
    }

    /**
     * Renders tab wrapper structure and adds tab buttons and panels.
     */
    render() {
        this.className =
            'w-full h-full overflow-hidden grid items-stretch grid-flow-row grid-cols-1 grid-rows-[var(--s)_1fr]';
        this.append(this.#createTabButtons());
        this.#createPanels();
    }
}

if (!customElements.get('tab-container')) {
    customElements.define('tab-container', TabContainer, { extends: 'div' });
}
