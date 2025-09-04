
import { renderPageTemplate } from './page.template.ts'
import { renderLanguageDropdownButton } from './languageDropdownButton.ts'
import { t } from './translation.ts'

export function renderProfile(main: HTMLElement) {
  renderPageTemplate(main, {
    title: "PROFILE",
    nextButtons: [
      { href: "/accountSettings", label: t("Account Settings") },
      { href: "/editProfile", label: t("Edit Profile") }
    ],
    backHref: "/central",
    showBack: true,
    homeHref: "/"
  });
  	const langDropdown = document.getElementById('lang-dropdown-container');
	if (langDropdown) {
	renderLanguageDropdownButton(langDropdown, () => renderProfile(main));
	}
}
