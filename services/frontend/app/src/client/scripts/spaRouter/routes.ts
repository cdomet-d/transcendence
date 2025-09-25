import * as page from '../../pages/html.pages.js'

interface routeInterface {
    path: string;
    callback: () => string;
}

export const routes: routeInterface[] = [
  { path: '/', callback: page.renderHome },
  { path: '/404', callback: page.render404 },
  { path: '/central', callback: page.renderCentral },
  { path: '/account', callback: page.renderProfile },
  { path: '/game/leaderboard', callback: page.renderLeaderboard },
  { path: '/game/tournament', callback: page.renderTournament },
  { path: '/game/match', callback: page.renderGame},
  { path: '/sendFriendRequest', callback: page.renderHome}
];
