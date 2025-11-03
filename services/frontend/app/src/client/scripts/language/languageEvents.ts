import { changeLanguage, currentLang } from './translation.js'
import { renderLanguageDropdownButton } from '../../pages/languageDropdownButton.js'
import { router } from '../main.js';

export function addLanguageEvents() {
	const switchBtn = document.getElementById('language-switch');
	const options = document.getElementById('language-options');

	if (!switchBtn || !options) return;

	switchBtn.addEventListener('click', () => {
		options.classList.toggle('hidden');
	});

	options.querySelectorAll('.dropdown-item').forEach(item => {
		item.addEventListener('click', () => {
			const lang = (item as HTMLElement).dataset.lang;
			if (lang && lang !== currentLang) {
				changeLanguage(lang);
				options.classList.add('hidden'); //TODO: what is this for ?
				rerenderPage();
			}
		});
	});
}

function rerenderPage() {
	const callback = router._getCallback();
	const langDropdown = document.getElementById('lang-dropdown-container');
	const page = document.getElementById('page');
	if (!langDropdown || !page)
		return; //TODO: handle error

	callback;
	langDropdown.innerHTML = renderLanguageDropdownButton();
	addLanguageEvents();
}
