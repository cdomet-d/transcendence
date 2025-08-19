import './style.css';
import { t, changeLanguage, init} from './translation';
import { currentLang } from './translation';

export function renderHome(main: HTMLElement) {
  main.innerHTML = `
    <div class="min-h-screen flex flex-col items-center justify-center bg-white space-y-8">
      <button id="language-switch" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-black font-semibold">
        ${t('switch_language')}
      </button>
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

  const languageSwitchBtn = document.getElementById('language-switch');
  if (languageSwitchBtn) {
	languageSwitchBtn.addEventListener('click', () => {
	  const languages = ['en', 'fr', 'es'];
	  const currentIndex = languages.indexOf(currentLang);
	  const newLang = languages[(currentIndex + 1) % languages.length];
	  changeLanguage(newLang);
	  renderHome(main);
	});
  }
}