import { 
  renderHome,
  render404,
  renderCentral,
  renderProfile,
  renderLeaderboard,
  renderTournament,
  renderGame } from '../../pages/html.pages.js';

export const routes = [
  { path: '/', callback: renderHome },
  { path: '/404', callback: render404 },
  { path: '/central', callback: renderCentral },
  { path: '/account', callback: renderProfile },
  { path: '/game/leaderboard', callback: renderLeaderboard },
  { path: '/game/tournament', callback: renderTournament },
  { path: '/game/match', callback: renderGame},
];
