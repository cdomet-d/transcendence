import { renderHome } from './home.ts';
import { render404 } from './404.ts';
import { renderCentral } from './central.ts';
import { renderProfile } from './profile.ts';
import { renderLeaderboard } from './leaderboard.ts';
import { renderTournament } from './tournament.ts';
import { wsRequest } from './pong/wsreply.ts';

export const routes = [
  { path: '/', callback: renderHome },
  { path: '/404', callback: render404 },
  { path: '/central', callback: renderCentral },
  { path: '/account', callback: renderProfile },
  { path: '/game/leaderboard', callback: renderLeaderboard },
  { path: '/game/tournament', callback: renderTournament },
  {path: '/game/match', callback: wsRequest},
];
