import type { ImgData } from '../types-interfaces';

export const farmAssets: ImgData[] = [
	{ id: 'fence', src: '/public/assets/images/farm-scene/fence.png', alt: 'ahah', size: 'iicon' },
	{ id: 'cow', src: '/public/assets/images/farm-scene/cow.gif', alt: 'ahah', size: 'iicon' },
	{
		id: 'fgrass',
		src: '/public/assets/images/farm-scene/fgrass.png',
		alt: 'ahah',
		size: 'iicon',
	},
	{
		id: 'cloud_r',
		src: '/public/assets/images/farm-scene/cloud-r.png',
		alt: 'ahah',
		size: 'iicon',
	},
	{
		id: 'cloud_l',
		src: '/public/assets/images/farm-scene/cloud-l.png',
		alt: 'ahah',
		size: 'iicon',
	},
	{ id: 'sky', src: '/public/assets/images/farm-scene/sky.png', alt: 'ahah', size: 'iicon' },
];

export const oceanAssets: ImgData[] = [
	{ id: 'tuna', src: '/public/assets/images/ocean-scene/tuna.png', alt: 'ahah', size: 'iicon' },
	{ id: 'coral', src: '/public/assets/images/ocean-scene/coral.png', alt: 'ahah', size: 'iicon' },
	{ id: 'algae', src: '/public/assets/images/ocean-scene/algae.png', alt: 'ahah', size: 'iicon' },
	{
		id: 'algae1',
		src: '/public/assets/images/ocean-scene/algae1.png',
		alt: 'ahah',
		size: 'iicon',
	},
	{
		id: 'algae2',
		src: '/public/assets/images/ocean-scene/algae2.png',
		alt: 'ahah',
		size: 'iicon',
	},
	{ id: 'sand', src: '/public/assets/images/ocean-scene/sand.png', alt: 'ahah', size: 'iicon' },
	{
		id: 'moutains',
		src: '/public/assets/images/ocean-scene/moutains.png',
		alt: 'ahah',
		size: 'iicon',
	},
	{
		id: 'ocean-bg',
		src: '/public/assets/images/ocean-scene/ocean-bg.png',
		alt: 'ahah',
		size: 'iicon',
	},
	{
		id: 'sunrays',
		src: '/public/assets/images/ocean-scene/sunrays.png',
		alt: 'ahah',
		size: 'iicon',
	},
];

export class Layout extends HTMLElement {
	/**
	 * 	The layout's cache.
	 */
	#innerComponents: Map<string, HTMLElement>;
	/**
	 * Storage for the rendered assets
	 */
	#assetCache: Map<string, HTMLElement>;
	#assetsList: ImgData[];

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
			const el = document.createElement('img');
			el.id = asset.id;
			el.className = asset.id;
			el.alt = asset.alt;
			el.src = asset.src;
			this.appendAndCache(el);
		});
	}

	render() {
		this.#renderTheme();
		this.className =
			'box-border relative grid h-screen w-screen grid-auto-rows-auto \
			place-content-center layout-col gap-s z-0';
	}

	/* -------------------------------------------------------------------------- */
	/*                                   Setters                                  */
	/* -------------------------------------------------------------------------- */
	set theme(list: ImgData[]) {
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
			component.classList.add('z-1');
			this.append(component);
			this.#innerComponents.set(component.id, component);
		});
	}
}

if (!customElements.get('custom-layout')) {
	customElements.define('custom-layout', Layout, { extends: 'main' });
}
