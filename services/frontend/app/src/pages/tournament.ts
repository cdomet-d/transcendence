
import { renderPageTemplate } from './page.template.js'

export function renderTournament(): string {
	return renderPageTemplate({
		title: "TOURNAMENT",
		nextButtons: [
			{ href: "/404", label: "4 players" },
			{ href: "/404", label: "8 players" },
			{ href: "/404", label: "16 players" },

		],
		backHref: "/central",
		showBack: true,
		homeHref: "/"
	});
}
