import * as page from '../../pages/render-pages.js';

interface routeInterface {
    path: string;
    callback: () => void;
}

export const routes: routeInterface[] = [
    { path: '/', callback: page.renderHome },
    { path: '/404', callback: page.renderNotFound },
    { path: '/leaderboard', callback: page.renderLeaderboard },
    //TODO: handle dynamic URL to serve the user's profile, not a generic profile page
    { path: '/user', callback: page.renderProfile },
    //   { path: '/central', callback: page.renderCentral },
    //   { path: '/game/tournament', callback: page.renderTournament },
    //   { path: '/game/match', callback: page.renderGame},
];
