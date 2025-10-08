import { cTitle } from './typography';
import { Icon, Avatar } from './images';
import * as types from '../../types-interfaces';

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
 * @param metadata - an interface of type {@link types.ImgMetadata}.
 * @returns The {@link Icon} element.
 */
export function createIcon(metadata: types.ImgMetadata): Icon {
    const el = document.createElement('img', { is: 'custom-icon' }) as Icon;
    if (!metadata) return el;
    el.metadata = metadata;
    return el;
}

/**
 * Creates an avatar element.
 *
 * @param metadata - an interface of type {@link types.ImgMetadata}. Optional - defaults to a medium-sized default avatar.
 * @returns The {@link Avatar} element.
 */
export function createAvatar(metadata?: types.ImgMetadata): Avatar {
    const el = document.createElement('div', { is: 'user-avatar' }) as Avatar;
    if (metadata) el.metadata = metadata;

    return el;
}
