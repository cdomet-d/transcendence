import { BaseForm } from './baseform.js';
import { createAvatar } from '../typography/helpers.js';
import { createDropdown } from '../navigation/menu-helpers.js';
import { createForm } from './helpers.js';
import { deleteAccount } from './default-forms.js';
import { DeleteAccountForm } from './account-deletion-form.js';
import { CriticalActionForm } from './auth.js';
import { user } from '../default-values.js';
import { userColorsMenu, languageMenu } from '../navigation/default-menus.js';
import type { Avatar } from '../typography/images.js';
import type { DropdownMenu } from '../navigation/menus.js';
import type { UserData } from '../types-interfaces.js';
import { downloadData } from './default-forms.js';
import { DowloadDataForm } from './downloadData-form.js';
import {
	exceptionFromResponse,
	errorMessageFromException,
	createVisualFeedback,
} from '../../error.js';
import { router } from '../../main.js';
import { currentDictionary, setLanguage } from './language.js';
import { PrivacyButtonForm } from './gdprForm.js';
import { privacyButton } from './default-forms.js';
// import imageCompression from 'browser-image-compression';

const MAX_FILE = 2 * 1024 * 1024;
/**
 * Custom form element for user settings, including avatar, color, language, and account deletion.
 * Extends BaseForm.
 */
export class UserSettingsForm extends BaseForm {
	#user: UserData;
	#accountDelete: DeleteAccountForm;
	#gdpr: PrivacyButtonForm;
	#dataDownload: DowloadDataForm;
	#colors: DropdownMenu;
	#languages: DropdownMenu;
	#avatar: Avatar;
	#previewAvatar: (ev: Event) => void;

	/* -------------------------------------------------------------------------- */
	/*                                   Default                                  */
	/* -------------------------------------------------------------------------- */

	/**
	 * Initializes the user settings form with user data, avatar, color and
	 * language dropdowns, and account deletion form.
	 */
	constructor() {
		super();
		this.#user = user;
		this.submitHandler = this.submitHandlerImplementation.bind(this);
		this.#previewAvatar = this.#previewAvatarImplementation.bind(this);
		this.#accountDelete = createForm(
			'delete-account-form',
			deleteAccount(currentDictionary),
		);
		this.#dataDownload = createForm(
			'download-data-request',
			downloadData(currentDictionary),
		);
		this.#gdpr = createForm(
			'privacy-button-form',
			privacyButton(currentDictionary),
		);
		this.#avatar = createAvatar(this.#user.avatar);
		this.#colors = createDropdown(userColorsMenu, currentDictionary.settings.pick_color, 'dynamic');
		this.#languages = createDropdown(languageMenu, currentDictionary.settings.pick_language, 'static');
	}

	override connectedCallback(): void {
		super.connectedCallback();
		this.contentMap.get('upload')?.addEventListener('input', this.#previewAvatar);
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback();
		this.contentMap.get('upload')?.removeEventListener('input', this.#previewAvatar);
	}

	override async createReqBody(form: FormData): Promise<string> {
		const fObject = Object.fromEntries(form.entries());
		if (fObject.username || fObject.password) {
			await CriticalActionForm.show();
		}
		const jsonBody = JSON.stringify(fObject);
		return jsonBody;
	}

	override async fetchAndRedirect(url: string, req: RequestInit): Promise<void> {
		try {
			let token = localStorage.getItem('criticalChange');
			if (token) {
				const objToken = JSON.parse(token);
				token = objToken.token;
				req.headers = {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				};
			}
			const rawRes = await fetch(url, req);
			if (!rawRes.ok) throw await exceptionFromResponse(rawRes);

			// [FIX] Update language based on request body
			if (req.body && typeof req.body === 'string') {
				try {
					const bodyObj = JSON.parse(req.body);
					console.log()
					if (bodyObj.language) {
						// Map full names to codes if necessary
						const langMap: { [key: string]: string } = {
							'English': 'English',
							'Français': 'Français',
							'Espanol': 'Espanol',
						};
						const newLangCode = langMap[bodyObj.language] || bodyObj.language;

						console.log("Updating language to:", newLangCode);

						// [CRITICAL] Await this so dictionary loads BEFORE redirect
						await setLanguage(newLangCode);
					}
				} catch (e) {
					console.error("Failed to parse request body for language update", e);
				}
			}

			// [FIX] REMOVED the line: setLanguage(user.language); 
			// That line was resetting the language to the OLD value stored in the default 'user' object.
			router.loadRoute('/me', true);
		} catch (error) {
			createVisualFeedback(errorMessageFromException(error));
		}
	}

	/**
	 * Handles the submit event for the form.
	 * Appends color and language selections to the form data if changed.
	 * @param ev - The submit event.
	 */
	override async submitHandlerImplementation(ev: SubmitEvent): Promise<void> {
		ev.preventDefault();
		const f = new FormData(this);
		const colSelection = this.#colors.selectedElement;
		const langSelection = this.#languages.selectedElement;

		if (this.#user) {
			if (colSelection && 'bg-' + colSelection.id !== this.#user.profileColor)
				f.append('color', 'bg-' + colSelection.id);
			if (langSelection && langSelection.id !== this.#user.language)
				f.append('language', langSelection.id);
		}

		if (f.get('upload') && this.#user) {
			const file = f.get('upload');
			if (!file || !(file instanceof File)) throw new Error('Error processing avatar');
			if (file.size > MAX_FILE)
				return createVisualFeedback('That file is way too heavy; max is 2MB. Ta!');
			if (file.name !== '') {
				console.log(file);
				try {
					// TODO: compress images
					const binaryAvatar = await this.#fileToBinary(file);
					if (binaryAvatar) f.append('avatar', binaryAvatar);
				} catch (error) {
					console.error('[USER-SETTINGS]', errorMessageFromException(error));
					createVisualFeedback(errorMessageFromException(error));
				}
			}
		}

		f.delete('upload');
		const req = this.initReq();
		req.body = await this.createReqBody(f);
		await this.fetchAndRedirect(this.details.action, req);
	}

	/* -------------------------------------------------------------------------- */
	/*                                  Rendering                                 */
	/* -------------------------------------------------------------------------- */

	/**
	 * Renders the user settings form, including avatar, title, fields,
	 * dropdowns, buttons, and account deletion form.
	 * Applies custom styles to certain fields.
	 */
	override render() {
		this.append(this.#avatar);
		super.renderTitle();
		super.renderFields();
		this.renderDropdowns();
		super.renderButtons();
		this.append(this.#accountDelete);
		this.append(this.#dataDownload);
		this.append(this.#gdpr);

		this.#avatar.classList.add('row-span-2', 'col-start-1', 'row-start-1');
		super.contentMap.get('title')?.classList.add('row-span-2', 'col-start-2', 'row-start-1');
		super.contentMap.get('upload')?.classList.add('row-start-3', 'col-start-1');
		super.contentMap.get('biography')?.classList.add('row-start-3', 'col-start-2');
		super.contentMap.get('username')?.classList.add('row-start-4', 'col-start-1');
		super.contentMap.get('password')?.classList.add('row-start-5', 'col-start-1');
		super.contentMap.get('submit')?.classList.add('row-start-6', 'col-start-2');
		this.#accountDelete.classList.add('row-start-7', 'col-start-1');
		this.#dataDownload.classList.add('row-start-7', 'col-start-2');
		this.classList.add('sidebar-left');
	}

	/**
	 * Renders the color and language dropdown menus.
	 */
	renderDropdowns() {
		const dropdownWrapper = document.createElement('div');
		dropdownWrapper.append(this.#colors, this.#languages);
		dropdownWrapper.className = 'grid gap-s grid-flow-col row-start-6 col-start-1';
		this.append(dropdownWrapper);
	}

	/* -------------------------------------------------------------------------- */
	/*                                   Setters                                  */
	/* -------------------------------------------------------------------------- */
	/**
	 * Sets the user data for the form.
	 * @param details - The user data object.
	 */
	//TODO change the setter to get the actual username
	set user(details: UserData) {
		this.#user = details;
		this.#avatar.metadata = details.avatar;

		if (this.#dataDownload) {
			this.#dataDownload.user = details;
		}
	}

	/* -------------------------------------------------------------------------- */
	/*                               Event listeners                              */
	/* -------------------------------------------------------------------------- */

	async #previewAvatarImplementation(ev: Event) {
		let target: HTMLInputElement | null = null;
		if (ev.target instanceof HTMLInputElement) {
			target = ev.target as HTMLInputElement;
		}
		if (!target) return;
		const file = target.files;
		if (!file) return;
		try {
			const binaryAvatar = await this.#fileToBinary(file[0]);
			if (binaryAvatar && this.#user.avatar) {
				this.#user.avatar.src = binaryAvatar;
				this.#avatar.metadata = this.#user.avatar;
			}
		} catch (error) {
			//TODO: better error handling;
			console.error(error);
		}
	}

	/**
	 * Converts uploaded file to binary string to send it in the request body.
	 * @throws `Error` if no file is found,  `DOMException` if conversion to DataURL fails.
	 * @param f - `Form Data`
	 * @returns `Promise<string | undefined>`
	 */
	#fileToBinary(file: File): Promise<string | undefined> {
		const reader = new FileReader();

		return new Promise((resolve, reject) => {
			reader.onload = () => {
				const res = reader.result;
				if (typeof res === 'string') resolve(res);
				else resolve(undefined);
			};
			reader.onerror = () => {
				reject(reader.error);
			};
			reader.onabort = () => {
				reject(new DOMException('Aborted reading', 'AbortError'));
			};
			reader.readAsDataURL(file);
		});
	}
}

if (!customElements.get('settings-form')) {
	customElements.define('settings-form', UserSettingsForm, { extends: 'form' });
}
