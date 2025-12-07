import { createHeading, createIcon } from '../typography/helpers';
import { createLink } from '../navigation/buttons-helpers';
import { createWrapper } from '../../render-pages';
import { goHomeData } from '../navigation/default-menus';
import { Popup } from '../layouts/popup';
import type { NavigationLinks } from '../navigation/links';
import type { ImgData } from '../types-interfaces';

export function endGame(img: ImgData, id: string) {
	const popup = document.createElement('dialog', { is: 'custom-popup' }) as Popup;
	const title = createHeading('1', 'You lost...');
	const image = createIcon(img);
	const wrapper = createWrapper(id);
	const goHome = createLink(goHomeData, false) as NavigationLinks;

	wrapper.append(title, image, goHome);
	popup.append(wrapper);
	document.body.layoutInstance?.appendAndCache(popup);
	wrapper.classList.add('grid', 'bg-000080', 'gap-s');
	wrapper.classList.remove('justify-start', 'bg');
	image.classList.add('place-self-center');
}

