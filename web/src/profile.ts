import './style.css'
import { renderPageTemplate } from './page.template'

export function renderProfile(main) {
  renderPageTemplate(main, {
    title: "PROFILE",
    nextButtons: [
      { href: "/accountSettings", label: "Account Settings" },
      { href: "/editProfile", label: "Edit Profile" }
    ],
    backHref: "/central",
    showBack: true,
    homeHref: "/"
  });
}
