import { BaseForm } from './baseform.js';
import { createVisualFeedback, redirectOnError } from '../../error.js';
import { createInputGroup } from '../inputs/helpers.js';
import { createUserInline } from '../users/profile-helpers.js';
import { InputGroup } from '../inputs/fields.js';
import { search } from './default-forms.js';
import type { UserData } from '../types-interfaces.js';
import { userArrayFromAPIRes } from '../../api-responses/user-responses.js';
import { createNoResult } from '../typography/helpers.js';
import type { Listbox } from '../navigation/listbox.js';
import { currentDictionary } from './language.js';

/**
 * Custom HTML form element representing a search bar UI component.
 *
 * @remarks
 * The search bar uses configured input metadata and button data to build the form.
 * It manages rendering of search results dynamically below the input.
 * Responsively adjusts results container position on window resize and scroll events.
 */
export class Searchbar extends BaseForm {
	#searchInput: InputGroup;
	#results: Listbox;

	#blurHandler: (ev: FocusEvent) => void;
	#navHandler: (ev: KeyboardEvent) => void;

    /* -------------- constructors and associated default functions ------------- */
    constructor() {
        super();
        super.details = search();
        this.#results = document.createElement('ul', {is: 'list-box'}) as Listbox;
        this.#searchInput = document.createElement('div', { is: 'input-and-label' }) as InputGroup;

		this.submitHandler = this.submitHandlerImplementation.bind(this);
		this.#blurHandler = this.#focusOutImplementation.bind(this);
		this.#navHandler = this.#navigationImplementation.bind(this);
	}

	override connectedCallback() {
		super.connectedCallback();
		this.addEventListener('focusout', this.#blurHandler);
		this.addEventListener('keydown', this.#navHandler);
	}

	override disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('focusout', this.#blurHandler);
		this.removeEventListener('keydown', this.#navHandler);
	}

	/* -------------------------------- rendering ------------------------------- */
	/**
	 * Renders the search bar structure including input, submit button, search icon, and results container.
	 * Sets form attributes and class names appropriately.
	 */
	override render() {
		const img = this.createSearchIcon() as HTMLImageElement;
		if (super.details.fields[0]) this.#searchInput = createInputGroup(super.details.fields[0]);

		this.#searchInput.append(img);
		this.append(this.#searchInput);
		super.renderButtons();
		this.append(this.#results);

		this.classList.add('search-cols', 'search-gap');
		this.#results.className =
			'hidden absolute top-[64px] brdr bg min-h-fit w-full overflow-y-auto box-border';
	}

	/**
	 * Creates and returns an image element used as the search icon within the input field.
	 *
	 * @returns {HTMLImageElement} The search icon image element.
	 */
	createSearchIcon(): HTMLImageElement {
		const img = document.createElement('img');
		img.className = 'w-s h-s absolute top-[6px] left-[6px]';
		img.src = '/public/assets/images/search-icon.png';
		img.alt = 'A pixel art magnifier';
		return img;
	}

	/* --------------------------------- getters -------------------------------- */

	get results() {
		return this.#results;
	}
	/* ----------------------------- event listeners ---------------------------- */

	override async fetchAndRedirect(url: string, req: RequestInit): Promise<void> {
		const response = await fetch(url, req);
		const data = await response.json();
		if (!data.ok) {
			if (data.message === 'Unauthorized')
				redirectOnError('/auth', 'You must be registered to access this page!');
		}

		this.displayResults(userArrayFromAPIRes(data));
	}

	#createQueryURL(form: FormData): string | undefined {
		const target = form.get('searchbar');
		if (!target) return undefined;
		let url = super.details.action;
		url += target;
		return url;
	}

	override async submitHandlerImplementation(ev: SubmitEvent) {
		ev.preventDefault();
		const form = new FormData(this);
		const url = this.#createQueryURL(form);
		if (!url) {
			createVisualFeedback(currentDictionary.error.something_wrong);
			return;
		}
		try {
			await this.fetchAndRedirect(url, this.initReq());
		} catch (error) {
			console.error(error);
		}
	}

	/* ---------------------------- result management --------------------------- */
	/**
	 * Clears all displayed search results from the results container.
	 */
	clearResults() {
		while (this.#results.firstChild) {
			this.#results.removeChild(this.#results.firstChild);
		}
	}

	#navigationImplementation(ev: KeyboardEvent) {
		const actions: { [key: string]: () => void } = {
			Escape: () => this.#results.collapse(),
		};

		if (actions[ev.key]) {
			ev.preventDefault();
			actions[ev.key]!();
		}
	}

	#focusOutImplementation(ev?: FocusEvent) {
		if (!ev) {
			this.#results.collapse();
		} else {
			const newFocus = ev.relatedTarget as HTMLElement | null;
			if (!newFocus || !this.contains(newFocus)) {
				this.#results.collapse();
			}
		}
	}

	/**
	 * @param {UserData} user - User data to render inline.
	 */
	addUser(user: UserData) {
		const li = document.createElement('li');
		li.classList.add('pad-xs');
		li.append(createUserInline(user))
		this.#results.append(li);
	}

	/**
	 * Displays a list of user search results.
	 * Clears existing results and toggles results container visibility.
	 *
	 * @param {UserData[]} res - Array of user data to display as search results.
	 */
	displayResults(res: UserData[]) {
		this.clearResults();
		if (res.length < 1) this.#results.append(createNoResult('light', 'ixl'));
		res.forEach((user) => this.addUser(user));
		this.#results.arrayFromChildren();
		this.#results.expand();
		this.classList.add('z-1')
	}
}

if (!customElements.get('search-form')) {
	customElements.define('search-form', Searchbar, { extends: 'form' });
}
