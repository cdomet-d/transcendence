import { renderHome } from './home.ts';
import { renderGame } from './game.ts';
import { render404 } from './404.ts';
import { renderCentral } from './central.ts';
import { renderProfile } from './profile.ts';
import { renderLeaderboard } from './leaderboard.ts';
import { renderTournament } from './tournament.ts';

export const routes = [
  { path: '/', callback: renderHome },
  { path: '/game', callback: renderGame },
  { path: '/404', callback: render404 },
  { path: '/tournament', callback: renderTournament },
  { path: '/central', callback: renderCentral },
  { path: '/profile', callback: renderProfile },
  { path: '/leaderboard', callback: renderLeaderboard },
];
