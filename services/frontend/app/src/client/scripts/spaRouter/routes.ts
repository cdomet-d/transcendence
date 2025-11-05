import * as page from '../../pages/render-pages.js'

interface routeInterface {
    path: string;
    callback: () => void;
}

export const routes: routeInterface[] = [
  { path: '/', callback: page.renderHome },
  { path: '/404', callback: page.renderNotFound },
  { path: '/leaderboard', callback: page.renderLeaderboard },
//   { path: '/central', callback: page.renderCentral },
//   { path: '/account', callback: page.renderProfile },
//   { path: '/game/tournament', callback: page.renderTournament },
//   { path: '/game/match', callback: page.renderGame},
];
