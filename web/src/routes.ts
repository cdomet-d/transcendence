import { renderHome } from './home.ts';
import { renderGame } from './game.ts';

export const routes = [
  { path: '/', callback: renderHome},
  {path: '/game', callback: renderGame},
];
