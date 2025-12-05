import { router } from './main.js';

export function loadHistoryLocation() {
    router.loadRoute(window.location.pathname, false);
}
