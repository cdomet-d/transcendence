import { renderHome } from '../pages/home.ts';
import { render404 } from '../pages/404.ts';
import { renderCentral } from '../pages/central.ts';
import { renderProfile } from '../pages/profile.ts';
import { renderLeaderboard } from '../pages/leaderboard.ts';
import { renderTournament } from '../pages/tournament.ts';
import { wsRequest } from '../pages/game/wsreply.ts';

export const routes = [
  { path: '/', callback: renderHome },
  { path: '/404', callback: render404 },
  { path: '/central', callback: renderCentral },
  { path: '/account', callback: renderProfile },
  { path: '/game/leaderboard', callback: renderLeaderboard },
  { path: '/game/tournament', callback: renderTournament },
  {path: '/game/match', callback: wsRequest},
];
