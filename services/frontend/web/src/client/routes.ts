import { renderHome } from './home.js';
import { render404 } from './404.js';
import { renderCentral } from './central.js';
import { renderProfile } from './profile.js';
import { renderLeaderboard } from './leaderboard.js';
import { renderTournament } from './tournament.js';
import { wsRequest } from './pong/wsreply.js';

export const routes = [
  { path: '/', callback: renderHome },
  { path: '/404', callback: render404 },
  { path: '/central', callback: renderCentral },
  { path: '/account', callback: renderProfile },
  { path: '/game/leaderboard', callback: renderLeaderboard },
  { path: '/game/tournament', callback: renderTournament },
  {path: '/game/match', callback: wsRequest},
];
