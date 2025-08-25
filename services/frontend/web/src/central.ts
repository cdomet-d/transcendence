import './style.css'
import { renderPageTemplate } from './page.template'
import { t } from './translation.ts'
import { renderLanguageDropdownButton } from './languageDropdownButton'

export function renderCentral(main: HTMLElement) {
  renderPageTemplate(main, {
	title: t('CENTRAL'),
	nextButtons: [
	  { href: "/tournament", label: t('Tournament') },
	  { href: "/quickMatch", label: t('Quick Match') },
	  { href: "/profile", label: t('Profile') },
	  { href: "/leaderboard", label: t('Leaderboard') },
	  { href: "/game", label: t('Game') },
	],
	backHref: "/",
	showBack: true,
	homeHref: "/"
  });
  	const langDropdown = document.getElementById('lang-dropdown-container');
  if (langDropdown) {
	renderLanguageDropdownButton(langDropdown, () => renderCentral(main));
  }
}
