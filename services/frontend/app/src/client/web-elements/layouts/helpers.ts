import { FullscreenPage } from './fullscreen.js';
import { pageWithHeader } from './page-with-header.js';

export interface HTMLElementTagMap {
    'page-w-header': pageWithHeader;
    'full-screen': FullscreenPage;
}

export function createLayout<K extends keyof HTMLElementTagMap>(
    HTMLMapKey: K
): HTMLElementTagMap[K] {
    const el = document.createElement('div', {
        is: HTMLMapKey as string,
    }) as HTMLElementTagMap[K];
    return el;
}
