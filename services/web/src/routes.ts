import { renderHome } from './home.js';
import { renderGame } from './game.js';
import { render404 } from './404.js';

export const routes = [
  { path: '/', callback: renderHome},
  {path: '/game', callback: renderGame},
  { path: '/404', callback: render404 },
];
