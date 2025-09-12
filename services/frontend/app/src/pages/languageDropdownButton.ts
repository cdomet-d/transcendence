import { currentLang } from '../client/scripts/language/translation.js'

function renderLanguageDropdownButton(): string {
  return `
	<div class="dropdown">
		<button id="language-switch" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-black font-semibold">
		  ${currentLang}
		</button>
		<div id="language-options" class="dropdown-content hidden absolute bg-white border rounded shadow-md mt-1">
		  <div class="dropdown-item" data-lang="en">English</div>
		  <div class="dropdown-item" data-lang="fr">Français</div>
		  <div class="dropdown-item" data-lang="es">Español</div>
		</div>
	</div>
  `;
}

export { renderLanguageDropdownButton };