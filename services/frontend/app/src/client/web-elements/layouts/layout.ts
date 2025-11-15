type Farm = ['fence', 'cow1', 'cow2', 'cow3', 'fgrass', 'cloud_r', 'cloud_l', 'sky'];

export const farm: Farm = ['fence', 'cow1', 'cow2', 'cow3', 'fgrass', 'cloud_r', 'cloud_l', 'sky'];

export class Layout extends HTMLDivElement {
    /**
     * 	The layout's cache.
     */
    #innerComponents: Map<string, HTMLElement>;
    /**
     * Storage for the rendered assets
     */
    #assetCache: Map<string, HTMLElement>;
    #assetsList: string[];

    /* -------------------------------------------------------------------------- */
    /*                                   Default                                  */
    /* -------------------------------------------------------------------------- */

    constructor() {
        super();
        this.id = 'layout';
        this.#innerComponents = new Map<string, HTMLElement>();
        this.#assetCache = new Map<string, HTMLSpanElement>();
        this.#assetsList = [];
    }

    connectedCallback() {
        this.render();
    }

    #renderTheme() {
        if (this.#assetCache.size > 0) {
            this.#assetCache.forEach((asset) => {
                asset.remove();
            });
        }
        this.#assetsList.forEach((asset) => {
            const el = document.createElement('span');
            el.className = asset;
			this.appendAndCache(el);
        });
    }

    render() {
		this.#renderTheme();
        this.className =
            'box-border grid h-dvh w-dvw grid-auto-rows-auto \
			place-content-center layout-col gap-s';
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Setters                                  */
    /* -------------------------------------------------------------------------- */
    set theme(list: Farm) {
        this.#assetsList = list;
		this.#renderTheme();
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Getters                                  */
    /* -------------------------------------------------------------------------- */

    get assetsCache(): Map<string, HTMLElement> {
        return this.#assetCache;
    }

    /**
     * Getter for this.#innerComponents.
     * @returns `Map<string, HTMLElement>`
     */
    get components(): Map<string, HTMLElement> {
        return this.#innerComponents;
    }

    /**
     *Returns a specific element from the cache.
     * @returns `HTMLElement` (the element found at the key) or `undefined`
     *(if the key was not found in the map)
     */
    getElement(key: string): HTMLElement | undefined {
        return this.#innerComponents.get(key);
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Methods                                  */
    /* -------------------------------------------------------------------------- */
    /**
     * Removes all elements contained in the layout object and clears the cache.
     */
    clearAll() {
        while (this.firstChild) this.removeChild(this.firstChild);
        this.#innerComponents.clear();
    }

    /**
     * Allows to append inner elements to the layout object, caching them as they we go.
     * Behaves like a variadic function in C.
     *
     * @param el - rest parameter behaving like an array but allowing the parameters to be passed one after the other.
     * @example page.appendAndCache(header, userProfile, ..., footer);
     */
    appendAndCache(...el: HTMLElement[]) {
        el.forEach((component) => {
            console.log('Appending:', component.id);
            this.append(component);
            this.#innerComponents.set(component.id, component);
        });
    }
}

if (!customElements.get('custom-layout')) {
    customElements.define('custom-layout', Layout, { extends: 'div' });
}
