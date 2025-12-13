import type { ImgData } from '../types-interfaces';

import algae from '../../assets/images/ocean-scene/algae.png';
import algae1 from '../../assets/images/ocean-scene/algae1.png';
import algae2 from '../../assets/images/ocean-scene/algae2.png';
import coral from '../../assets/images/ocean-scene/coral.png';
import moutains from '../../assets/images/ocean-scene/moutains.png';
import ocean from '../../assets/images/ocean-scene/ocean-bg.png';
import sand from '../../assets/images/ocean-scene/sand.png';
import sunray from '../../assets/images/ocean-scene/sunrays.png';
import tuna from '../../assets/images/ocean-scene/tuna.png';

import cloudl from '../../assets/images/farm-scene/cloud-l.png';
import cloudr from '../../assets/images/farm-scene/cloud-r.png';
import cow from '../../assets/images/farm-scene/cow.gif';
import fence from '../../assets/images/farm-scene/fence.png';
import fgrass from '../../assets/images/farm-scene/fgrass.png';
import sky from '../../assets/images/farm-scene/sky.png';

export const farmAssets: ImgData[] = [
	{ id: 'fence', src: fence, alt: 'ahah', size: 'iicon' },
	{ id: 'cow', src: cow, alt: 'ahah', size: 'iicon' },
	{ id: 'fgrass', src: fgrass, alt: 'ahah', size: 'iicon' },
	{ id: 'cloud_r', src: cloudr, alt: 'ahah', size: 'iicon' },
	{ id: 'cloud_l', src: cloudl, alt: 'ahah', size: 'iicon' },
	{ id: 'sky', src: sky, alt: 'ahah', size: 'iicon' },
];

export const oceanAssets: ImgData[] = [
	{ id: 'tuna', src: tuna, alt: 'ahah', size: 'iicon' },
	{ id: 'coral', src: coral, alt: 'ahah', size: 'iicon' },
	{ id: 'algae', src: algae, alt: 'ahah', size: 'iicon' },
	{ id: 'algae2', src: algae1, alt: 'ahah', size: 'iicon' },
	{ id: 'algae2', src: algae2, alt: 'ahah', size: 'iicon' },
	{ id: 'sand', src: sand, alt: 'ahah', size: 'iicon' },
	{ id: 'moutains', src: moutains, alt: 'ahah', size: 'iicon' },
	{ id: 'ocean-bg', src: ocean, alt: 'ahah', size: 'iicon' },
	{ id: 'sunrays', src: sunray, alt: 'ahah', size: 'iicon' },
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
