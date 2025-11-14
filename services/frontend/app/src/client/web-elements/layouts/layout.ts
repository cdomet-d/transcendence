import type { BackgroundTheme, ImgData } from '../types-interfaces';

export class Layout extends HTMLDivElement {
    /**
     * 	The layout's cache.
     */
    #innerComponents: Map<string, HTMLElement>;

    /**
     * Array of assets metadata for custom background
     */
    #assets: ImgData[] | null;

    /**
     * Storage for the rendered assets
     */
    #assetCache: Map<string, HTMLElement>;
    #theme: BackgroundTheme;

    /* -------------------------------------------------------------------------- */
    /*                                   Default                                  */
    /* -------------------------------------------------------------------------- */

    constructor() {
        super();
        this.id = 'layout';
        this.#innerComponents = new Map<string, HTMLElement>();
        this.#innerComponents = new Map<string, HTMLImageElement>();
        this.#assets = null;
        this.#theme = 'default';
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.className =
            'box-border grid h-dvh w-dvw grid-auto-rows-auto \
			place-content-center layout-col gap-s';
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Setters                                  */
    /* -------------------------------------------------------------------------- */
    set assets(assets: ImgData[]) {
        this.#assets = assets;
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Getters                                  */
    /* -------------------------------------------------------------------------- */

    get assets(): ImgData[] | null {
        return this.#assets;
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
