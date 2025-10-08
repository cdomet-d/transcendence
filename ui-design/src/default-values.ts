import type { BtnMetadata } from "./types-interfaces";

export const socialMenu: Array<BtnMetadata> = [
	{
		content: null,
		role: 'social-menu',
		img: {
			id: 'friendship',
			src: '/assets/icons/add-user.png',
			alt: 'a small pixel art blue blob with a green plus sign',
			size: 'ismall',
		},
		ariaLabel: 'Add user as friend',
	},
	{
		content: null,
		role: 'social-menu',
		img: {
			id: 'challenge',
			src: '/assets/icons/challenge.png',
			alt: 'two overlapping pixel art ping pong paddles',
			size: 'ismall',
		},
		ariaLabel: 'Challenge user to a game',
	},
];
