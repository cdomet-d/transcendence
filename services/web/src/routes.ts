import { renderHome } from './home.js';
import { renderGame } from './game.js';

export const routes = [
  { path: '/', callback: renderHome},
  {path: '/game', callback: renderGame},
];
