import './style.css'
import { renderPageTemplate } from './page.template'

export function renderTournament(main) {
	renderPageTemplate(main, {
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
