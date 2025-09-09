import { t, changeLanguage, currentLang } from './translation.ts'

export function renderLanguageDropdownButton(target: HTMLElement, rerenderPageCallback: () => void) {
target.innerHTML = `
	    <div class="dropdown">
      <button id="language-switch" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-black font-semibold">
        ${t(currentLang)}
      </button>
      <div id="language-options" class="dropdown-content hidden absolute bg-white border rounded shadow-md mt-1">
        <div class="dropdown-item" data-lang="en">English</div>
        <div class="dropdown-item" data-lang="fr">Français</div>
        <div class="dropdown-item" data-lang="es">Español</div>
      </div>
    </div>
`;

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
        rerenderPageCallback();
      }
    });
  });
}