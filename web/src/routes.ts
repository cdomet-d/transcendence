import { renderHome } from './home.ts';
import { renderGame } from './game.ts';
import { render404 } from './404.ts';

export const routes = [
  { path: '/', callback: renderHome },
  { path: '/game', callback: renderGame },
  { path: '/404', callback: render404 },
];
