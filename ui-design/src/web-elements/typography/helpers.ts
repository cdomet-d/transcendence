import { CustomTitle } from './typography';
import { Icon, Avatar } from './images';
import * as types from '../../types-interfaces';

/**
 * Creates a heading element with a specified level.
 *
 * @param level - Heading level ('1', '2', '3'); defaults to '1'.
 * @param content - Text content of the heading.
 * @returns The created {@link CustomTitle} element.
 */
export function createHeading(level: string, content: string): CustomTitle {
    const el = document.createElement('custom-title') as CustomTitle;
    el.setAttribute('level', level);
    el.content = content;

    return el;
}

/**
 * Creates a custom icon element.
 *
 * @param metadata - an interface of type {@link types.ImgData}.
 * @returns The {@link Icon} element.
 */
export function createIcon(metadata: types.ImgData): Icon {
    const el = document.createElement('img', { is: 'custom-icon' }) as Icon;
    if (!metadata) return el;
    el.metadata = metadata;
    return el;
}

/**
 * Creates an avatar element.
 *
 * @param metadata - an interface of type {@link types.ImgData}. Optional - defaults to a medium-sized default avatar.
 * @returns The {@link Avatar} element.
 */
export function createAvatar(metadata?: types.ImgData): Avatar {
    const el = document.createElement('div', { is: 'user-avatar' }) as Avatar;
    if (metadata) el.metadata = metadata;

    return el;
}
