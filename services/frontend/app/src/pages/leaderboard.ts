
import { renderPageTemplate } from './page.template.js'

export function renderLeaderboard(): string {
	return renderPageTemplate({
		title: "LEADERBOARD",
		nextButtons: [
		],
		backHref: "/central",
		showBack: true,
		homeHref: "/"
	});
}
