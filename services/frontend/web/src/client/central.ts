
import { renderPageTemplate } from './page.template.ts'
import { t } from './translation.ts'
import { renderLanguageDropdownButton } from './languageDropdownButton.ts'

export function renderCentral(main: HTMLElement) {
  renderPageTemplate(main, {
	title: t('CENTRAL'),
	nextButtons: [
	  { href: "/game/tournament", label: t('Tournament') },
	  { href: "/quickMatch", label: t('Quick Match') },
	  { href: "/account", label: t('Profile') },
	  { href: "/game/leaderboard", label: t('Leaderboard') },
	  { href: "/game/match", label: t('Game') },
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
