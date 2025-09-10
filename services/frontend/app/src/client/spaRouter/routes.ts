// import { renderHome } from '../scripts/home.ts';
// import { render404 } from '../scripts/404.ts';
// import { renderCentral } from '../scripts/central.ts';
// import { renderProfile } from '../scripts/profile.ts';
// import { renderLeaderboard } from '../scripts/leaderboard.ts';
// import { renderTournament } from '../scripts/tournament.ts';
// // import { wsRequest } from '../scripts/game/wsreply.ts';

// export const routes = [
//   { path: '/', callback: renderHome },
//   { path: '/404', callback: render404 },
//   { path: '/central', callback: renderCentral },
//   { path: '/account', callback: renderProfile },
//   { path: '/game/leaderboard', callback: renderLeaderboard },
//   { path: '/game/tournament', callback: renderTournament },
//   // { path: '/game/match', callback: wsRequest},
// ];

import { renderHome } from '../../pages/html.pages.js';
import { render404 } from '../../pages/404HTML.js';
import { renderCentral } from '../../pages/html.pages.js';
import { renderProfile } from '../../pages/html.pages.js';
import { renderLeaderboard } from '../../pages/html.pages.js';
import { renderTournament } from '../../pages/html.pages.js';
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
