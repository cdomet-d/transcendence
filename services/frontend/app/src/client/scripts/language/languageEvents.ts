import { changeLanguage, currentLang } from './translation.js'
import { renderLanguageDropdownButton } from '../../../pages/languageDropdownButton.js'

export function addLanguageEvents(callback: () => string) {
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
				options.classList.add('hidden');
				rerenderPage(callback);
			}
		});
	});
}

function rerenderPage(callback: () => string) {
	const langDropdown = document.getElementById('lang-dropdown-container');
	const page = document.getElementById('page');
	if (!langDropdown || !page)
		return;

	page.innerHTML = callback();
	langDropdown.innerHTML = renderLanguageDropdownButton();
	addLanguageEvents(callback);
}
