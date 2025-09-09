
import { renderPageTemplate } from './page.template.js'
import { translate } from './language/translation.js'

export function renderProfile(): string {
	return renderPageTemplate({
		title: "PROFILE",
		nextButtons: [
			{ href: "/accountSettings", label: translate("Account Settings") },
			{ href: "/editProfile", label: translate("Edit Profile") }
		],
		backHref: "/central",
		showBack: true,
		homeHref: "/"
	});
}
