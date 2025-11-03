interface WindowSize {
    width: number;
    height: number;
}

export class Layout extends HTMLDivElement {
    /**
     * 	The layout's cache.
     */
    #innerComponents: Map<string, HTMLElement>;
    #size: WindowSize;
    #resizeHandler: (event: Event) => void;

    constructor() {
        super();
        this.#innerComponents = new Map<string, HTMLElement>();
        this.className = 'box-border grid place-items-center';
        this.id = 'layout';
        this.#size = { height: 0, width: 0 };
        this.#resizeHandler = this.computeViewportSize.bind(this);
    }

    /**
     * Getter for this.#innerComponents.
     * @returns `Map<string, HTMLElement>`
     */
    get components(): Map<string, HTMLElement> {
        return this.#innerComponents;
    }

    get size(): WindowSize {
        return this.#size;
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

    /** Determines the size of the viewport; ensures things remain relatively dynamic (but not too much either) */
    computeViewportSize() {
        if (window) {
            this.#size.width = window.innerWidth;
            this.#size.height = window.innerHeight;
			this.style.width = `${this.size.width}px`;
			this.style.height = `${this.size.height}px`;
        } else console.log('No window found');
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
        if (window) window.addEventListener('resize', this.#resizeHandler);
        this.render();
    }

    render() {
        this.computeViewportSize();
        this.classList.add('grid', 'place-content-center');
    }
}
