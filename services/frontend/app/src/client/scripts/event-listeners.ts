import { router } from './main.js';

/** Cleans up URL if it is not normalized */


interface WindowSize {
    width: number;
    height: number;
}

export function computeViewportSize() {
    const size: WindowSize = { width: 0, height: 0 };
    if (window) {
        size.width = window.innerWidth;
        size.height = window.innerHeight;
        document.body.style.width = `${size.width}px`;
        document.body.style.height = `${size.height}px`;
    } else console.log('No window found');
}

export function loadHistoryLocation() {
    const cleanPath = router.sanitisePath(window.location.pathname);
    router.loadRoute(cleanPath);
}

