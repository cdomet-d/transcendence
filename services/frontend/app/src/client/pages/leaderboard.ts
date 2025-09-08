
import { renderPageTemplate } from './page.template.ts'

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
