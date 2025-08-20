import { t, currentLang, changeLanguage } from './translation.ts' 
import { renderCentral } from './central.ts';

type NavButton = {
  href: string;
  label: string;
};

export function renderPageTemplate(main: HTMLElement, {
  title,
  nextButtons = [],
  backHref,
  showBack = true,
  homeHref = "/"
}: {
    title: string;
    nextButtons?: NavButton[];
    backHref?: string;
    showBack?: boolean;
    homeHref?: string;

}) {
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
    <div class="pt-12 text-center text-2xl font-bold">${title}</div>
    <div class="flex justify-center mt-32 gap-8">
      ${nextButtons.map(btn => `
        <a
          href="${btn.href}"
          data-link
          class="py-6 px-20 rounded-full border-2 border-black bg-gradient-to-br from-[#8be300] to-[#12a51a] shadow-lg hover:scale-110 transition-all text-white text-2xl font-semibold"
        >
          ${btn.label}
        </a>
      `).join('')}
    </div>
    <div class="fixed inset-x-0 bottom-0 flex justify-center gap-4 mb-2">
      ${showBack && backHref ? `
        <a
          href="${backHref}"
          data-link
          id="back-btn"
          class="py-3 px-8 rounded-full border border-black bg-gradient-to-br from-[#ffcc00] to-[#ea9800] shadow-md hover:scale-105 transition-all text-white text-lg font-semibold"
        >
          Back
        </a>
      ` : ''}
      <a
        href="${homeHref}"
        data-link
        id="home-btn"
        class="py-3 px-8 rounded-full border border-black bg-gradient-to-br from-[#ff0000] to-[#ea0075] shadow-md hover:scale-105 transition-all text-white text-lg font-semibold"
      >
        HOME
      </a>
    </div>
  `;

  
  function setupLanguageDropdown(main: HTMLElement) {
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
		  renderCentral(main);
		}
	  });
	});
  
	document.addEventListener('click', (e) => {
	  if (!main.contains(e.target as Node)) {
		options.classList.add('hidden');
	  }
	});
  }
  
  setupLanguageDropdown(main);
}
