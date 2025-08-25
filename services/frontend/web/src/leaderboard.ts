import './style.css'
import { renderPageTemplate } from './page.template'

export function renderLeaderboard(main: HTMLElement) {
	renderPageTemplate(main, {
		title: "LEADERBOARD",
		nextButtons: [
		],
		backHref: "/central",
		showBack: true,
		homeHref: "/"
	});
}
