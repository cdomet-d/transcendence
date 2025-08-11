import './style.css'
import { renderPageTemplate } from './page.template'

export function renderLeaderboard(main) {
	renderPageTemplate(main, {
		title: "LEADERBOARD",
		nextButtons: [
		],
		backHref: "/central",
		showBack: true,
		homeHref: "/"
	});
}
