import { renderPageTemplate } from './page.template.js'
import { translate } from './language/translation.js'

export function renderCentral(): string {
	return renderPageTemplate({
		title: translate('CENTRAL'),
		nextButtons: [
		{ href: "/game/tournament", label: translate('Tournament') },
		{ href: "/quickMatch", label: translate('Quick Match') },
		{ href: "/account", label: translate('Profile') },
		{ href: "/game/leaderboard", label: translate('Leaderboard') },
		{ href: "/game/match", label: translate('Game') },
		],
		backHref: "/",
		showBack: true,
		homeHref: "/"
	});
}

