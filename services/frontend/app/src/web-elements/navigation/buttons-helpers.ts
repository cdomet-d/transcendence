import { CustomButton } from './buttons.js';
import type { buttonData } from '../types-interfaces.js';

/**
 * Creates a menu button element configured with provided button data.
 *
 * @param {type.buttonData} btn - Object containing button text, type, image, and aria-label.
 * @param {boolean} [animated] - Optional flag to enable text animation on the button.
 * @returns {HTMLButtonElement} The created {@link CustomButton} element.
 *
 */
export function createBtn(btn: buttonData, animated?: boolean): CustomButton {
    const el = document.createElement('button', { is: 'custom-button' }) as CustomButton;
    el.btn = btn;
    if (animated) el.animation = animated;
    return el;
}
