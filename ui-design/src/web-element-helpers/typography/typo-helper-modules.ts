import { cTitle } from '../../web-elements/typography/typography';
import { Icon, Avatar } from '../../web-elements/typography/images';

/** Defines size options for {@link Avatar}. */ 
export type Size = 's' | 'm' | 'l';

/**
 * Creates a heading element with a specified level.
 *
 * @param level - Heading level ('1', '2', '3'); defaults to '1'.
 * @param content - Text content of the heading.
 * @returns The created {@link cTitle} element.
 *
 * @example
 * const heading = createHeading("3", "Section Title");
 * document.body.appendChild(heading);
 */
export function createHeading(level: string, content: string): cTitle {
    const el = document.createElement('c-title') as cTitle;
    el.setAttribute('level', level);
    el.content = content;

    return el;
}

/**
 * Creates a custom icon element.
 *
 * @param src - URL of the icon image.
 * @param alt - Alternative text for accessibility.
 * @returns The {@link Icon} element.
 */
export function createIcon(src: string, alt: string): Icon {
    const el = document.createElement('img', { is: 'custom-icon' }) as Icon;
    el.alt = alt;
    el.src = src;
    return el;
}

/**
 * Creates an avatar element.
 *
 * @param src - Image source URL.
 * @param alt - Alt text for accessibility.
 * @param s - Size option, 's', 'm', or 'l'.
 * @returns The {@link Avatar} element.
 */
export function createAvatar(src: string, alt: string, s: Size): Avatar {
    const el = document.createElement('div', { is: 'user-avatar' }) as Avatar;
    el.alt = alt;
    el.src = src;
    el.size = s;

    return el;
}
