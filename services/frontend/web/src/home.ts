import './style.css';
import { t, changeLanguage } from './translation';
import { currentLang } from './translation';

export function renderHome(main: HTMLElement) {
  main.innerHTML = `
      <div class="dropdown">
        <button id="language-switch" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-black font-semibold">
          ${t(currentLang)}  <!-- Show current language name -->
        </button>
        <div id="language-options" class="dropdown-content hidden absolute bg-white border rounded shadow-md mt-1">
          <div class="dropdown-item px-4 py-2 hover:bg-gray-200 cursor-pointer" data-lang="en">English</div>
          <div class="dropdown-item px-4 py-2 hover:bg-gray-200 cursor-pointer" data-lang="fr">Français</div>
          <div class="dropdown-item px-4 py-2 hover:bg-gray-200 cursor-pointer" data-lang="es">Español</div>
        </div>
      </div>
      <div class="min-h-screen flex items-center justify-center bg-white">
        <a
          href="/central"
          data-link
          id="play-btn"
          class="relative flex items-center justify-center px-20 py-8 rounded-full bg-gradient-to-br from-[#ea9800] to-[#ffcc00] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 group text-white font-bold text-5xl uppercase tracking-widest"
          title="${t('play')}"
        >
          <span class="absolute inset-0 rounded-full border-2 border-black/80 pointer-events-none"></span>
          <span class="relative z-10">${t('play')}</span>
        </a>
      </div>
    </div>
  `;

function setupLanguageDropdown(main: HTMLElement) {
  const switchBtn = document.getElementById('language-switch');
  const options = document.getElementById('language-options');

  if (!switchBtn || !options) return;

  // Toggle dropdown visibility on button click
  switchBtn.addEventListener('click', () => {
    options.classList.toggle('hidden');
  });

  // When option clicked, change language and rerender home
  options.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      const lang = (item as HTMLElement).dataset.lang;
      if (lang && lang !== currentLang) {
        changeLanguage(lang);
        options.classList.add('hidden');
        renderHome(main);
      }
    });
  });

  // Close dropdown if clicking outside
  document.addEventListener('click', (e) => {
    if (!main.contains(e.target as Node)) {
      options.classList.add('hidden');
    }
  });
}

setupLanguageDropdown(main);

}
