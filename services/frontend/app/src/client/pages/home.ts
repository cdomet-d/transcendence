;
import { t } from './language/translation.ts';
import { renderLanguageDropdownButton } from './language/languageDropdownButton.ts'

export function renderHome(main: HTMLElement) {
  main.innerHTML = `
	<div class="top-center-button" id="lang-dropdown-container"></div>
      <div class="min-h-screen flex items-center justify-center bg-white">
        <a
          href="/central"
          data-link
          id="play-btn"
          class="relative flex items-center justify-center px-20 py-8 rounded-full bg-gradient-to-br from-[#ea9800] to-[#ffcc00] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 group text-white font-bold text-5xl uppercase tracking-widest"
          title="${t('Play')}"
        >
          <span class="absolute inset-0 rounded-full border-2 border-black/80 pointer-events-none"></span>
          <span class="relative z-10">${t('Play')}</span>
        </a>
      </div>
    </div>
  `;

    const langDropdown = document.getElementById('lang-dropdown-container');
  if (langDropdown) {
    renderLanguageDropdownButton(langDropdown, () => renderHome(main));
  }
}
