import './style.css'
import { renderPageTemplate } from './page.template'

export function renderCentral(main: HTMLElement) {
  renderPageTemplate(main, {
	title: "CENTRAL",
	nextButtons: [
	  { href: "/tournament", label: "Tournament" },
	  { href: "/quickMatch", label: "Quick Match" },
	  { href: "/profile", label: "Profile" },
	  { href: "/leaderboard", label: "Leaderboard" },
	  { href: "/game", label: "Game" },
	],
	backHref: "/",
	showBack: true,
	homeHref: "/"
  });
}
