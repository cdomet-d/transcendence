import { createHeading, createIcon } from '../typography/helpers';
import { createLink } from '../navigation/buttons-helpers';
import { createWrapper } from '../../render-pages';
import { goHomeData } from '../navigation/default-menus';
import { Popup } from '../layouts/popup';
import type { NavigationLinks } from '../navigation/links';
import type { ImgData, MatchParticipants } from '../types-interfaces';
import { TournamentBrackets } from './tournament';

export function endGame(img: ImgData, id: string, mess: string) {
	const popup = document.createElement('dialog', { is: 'custom-popup' }) as Popup;
	const title = createHeading('1', mess);
	const image = createIcon(img);
	const wrapper = createWrapper(id);
	const goHome = createLink(goHomeData, false) as NavigationLinks;

	wrapper.append(title, image, goHome);
	popup.append(wrapper);
	document.body.layoutInstance?.appendAndCache(popup);
	wrapper.classList.add('grid', 'bg-000080', 'gap-s', 'z5');
	wrapper.classList.remove('justify-start', 'bg');
	image.classList.add('place-self-center');
}

export function createBracket(tournament: MatchParticipants[]) {
	const popup = document.createElement('dialog', { is: 'custom-popup' }) as Popup;

	const bracket = document.createElement('div', {
		is: 'tournament-bracket',
	}) as TournamentBrackets;
	if (bracket) bracket.players = tournament;
	popup.append(bracket)
	document.body.layoutInstance?.appendAndCache(popup);
}