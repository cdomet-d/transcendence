import { renderHome } from '../pages/home.js';
import { render404 } from '../pages/404.js';
import { renderCentral } from '../pages/central.js';
import { renderProfile } from '../pages/profile.js';
import { renderLeaderboard } from '../pages/leaderboard.js';
import { renderTournament } from '../pages/tournament.js';
// import { wsRequest } from '../scripts/game/wsreply.ts';

export const routes = [
  { path: '/', callback: renderHome },
  { path: '/404', callback: render404 },
  { path: '/central', callback: renderCentral },
  { path: '/account', callback: renderProfile },
  { path: '/game/leaderboard', callback: renderLeaderboard },
  { path: '/game/tournament', callback: renderTournament },
  // { path: '/game/match', callback: wsRequest},
];
