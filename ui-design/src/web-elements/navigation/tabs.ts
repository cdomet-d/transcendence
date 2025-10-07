import { tabBtn, tabGroup } from './buttons';
import { createTabs } from '../../web-element-helpers/navigation/nav-helper-modules';

/**
 * Represents a tab with identifying data and display content.
 *
 * @property id - The identifier for the tab. Must be unique.
 * @property content - The visible text or content.
 * @property default - Indicates the default tab to be displayed on page load. Should be unique, but if it's not, the default tab will be the first which has `default: true`.
 *
 * @example
 * const exampleTab: Tab = {
 *   id: "home",
 *   content: "Home",
 * };
 */
export interface Tab {
    id: string;
    content: string;
    default: boolean;
}

/**
 * Creates a tab panel extending HTMLDivElement.
 *
 * @example
 * const tabs: Tab[] = [
 *   { data: "home", content: "Home" },
 *   { data: "profile", content: "Profile" },
 * ];
 * const tabGroup = document.createElement("div", { is: "tab-group" }) as tabGroup;
 * document.body.appendChild(tabGroup);
 */
export class tabPanel extends HTMLDivElement {
    static get observedAttributes() {
        return ['selected'];
    }
    constructor() {
        super();
    }

    updateClassList(newClass: string) {
        this.classList.add(newClass);
    }
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
    connectedCallback() {
        this.render();
    }

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
 * By default, it creates a single "default" tab and panel.
 * The user should set the internal #tabList propriety at create time to personnalize the content.
 * You should use {@link createTabs} for that.
 *
 * @extends {HTMLDivElement}
 *
 * @example
 * const tabWrapper = document.createElement('div', { is: 'tab-wrapper' }) as tabWrapper;
 * document.body.appendChild(tabWrapper);
 */

export class tabWrapper extends HTMLDivElement {
    #tabList: Array<Tab>;

    constructor() {
        super();
        this.#tabList = [{ id: 'default', content: 'default', default: true }];
    }

    set tabList(tabList: Array<Tab>) {
        this.#tabList = tabList;
        if (!this.isValidTabList(this.#tabList))
            throw new Error('Duplicate Tab.data will lead to UI confusion. Check your TabInfo array.');
    }

    attachEvent() {
        this.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as Element | null;

            if (target) {
                const tab: Element | null = target.closest('.tab');
                if (tab && this.contains(tab)) this.animateTab(tab);
            }
        });
    }

    connectedCallback() {
        this.render();
        this.attachEvent();
    }

    render() {
        this.className =
            'clear-bg brdr w-[100%] overflow-hidden grid items-stretch grid-flow-row grid-cols-[1fr] grid-rows-[var(--s)_1fr]';
        this.appendChild(this.createTabButtons());
        this.createPanels();
    }

    private isValidTabList(tabList: Array<Tab>): boolean {
        return tabList.every((item, i, self) => i === self.findIndex((t) => t.id === item.id));
    }

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

    private createTabButtons(): HTMLDivElement {
        let isSet: boolean = false;

        const tabHeader = document.createElement('div', {
            is: 'tab-group',
        }) as tabGroup;

        this.#tabList.forEach((tab) => {
            const el = document.createElement('button', { is: 'tab-button' }) as tabBtn;
            el.setAttribute('data-tab', tab.id);
            el.textContent = tab.content;
            console;
            if (tab.default && !isSet) {
                isSet = true;
                el.setAttribute('selected', '');
            }
            tabHeader.appendChild(el);
        });
        return tabHeader;
    }

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
