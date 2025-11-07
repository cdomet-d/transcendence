export class Layout extends HTMLDivElement {
    /**
     * 	The layout's cache.
     */
    #innerComponents: Map<string, HTMLElement>;

    constructor() {
        super();
        this.id = 'layout';
        this.#innerComponents = new Map<string, HTMLElement>();
        this.className =
            'box-border grid grid-cols-[75%] min-h-full auto-rows-auto place-content-center gap-m';
    }

    /**
     * Getter for this.#innerComponents.
     * @returns `Map<string, HTMLElement>`
     */
    get components(): Map<string, HTMLElement> {
        return this.#innerComponents;
    }
    /** Returns a specific element from the cache.
	/* @returns `HTMLElement` (the element found at the key) or `undefined` (if the key was not found in the map)
	 */
    getElement(key: string): HTMLElement | undefined {
        return this.#innerComponents.get(key);
    }

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
            console.log('Appending:', component.tagName);
            this.append(component);
            this.#innerComponents.set(component.id, component);
        });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.classList.add(
            'grid',
            'h-screen',
            'min-w-80',
            'place-content-between',
            'grid-auto-rows-auto',
            'single-col-xl',
        );
    }
}

if (!customElements.get('custom-layout')) {
    customElements.define('custom-layout', Layout, { extends: 'div' });
}
