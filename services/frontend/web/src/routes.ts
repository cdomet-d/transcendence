import { renderHome } from './home.js';
import { renderGame } from './game.js';
import { render404 } from './404.js';
import { renderCentral } from './central.js';
import { renderProfile } from './profile.js';
import { renderLeaderboard } from './leaderboard.js';
import { renderTournament } from './tournament.js';

export const routes = [
  { path: '/', callback: renderHome },
  { path: '/game', callback: renderGame },
  { path: '/404', callback: render404 },
  { path: '/tournament', callback: renderTournament },
  { path: '/central', callback: renderCentral },
  { path: '/profile', callback: renderProfile },
  { path: '/leaderboard', callback: renderLeaderboard },
];
