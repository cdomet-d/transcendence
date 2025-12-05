import * as types from './types-interfaces.js';

export const biographyPattern: string = '^[A-Za-z0-9\\s,\\.\\?!:\\)\\(\\/\\-_]{0,256}$';
export const passwordPattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{12,64}$';
export const usernamePattern: string = '^[A-Za-z0-9]{4,18}$';
export const searchbarPattern: string = '^[A-Za-z0-9]{0,18}$';

export const defaultAvatar: types.ImgData = {
	alt: 'A pink pixel art little blob',
	id: 'user-avatar',
	size: 'ilarge',
	src: '/public/assets/images/purple-avatar.png',
};

export const user: types.UserData = {
	avatar: {
		alt: 'pp',
		id: 'user-avatar',
		size: 'ilarge',
		src: '/public/assets/images/magenta-avatar.png',
	},
	biography: '(╯°□°)╯︵ ┻━┻',
	id: '256',
	relation: 'stranger',
	profileColor: 'bg-BE5103',
	language: 'English',
	status: true,
	username: 'CrimeGoose',
	winstreak: '7',
	since: '145',
};

export const u1: types.UserData = {
	avatar: {
		alt: 'pp',
		id: 'user-avatar',
		size: 'iicon',
		src: '/public/assets/images/magenta-avatar.png',
	},
	biography: '(╯°□°)╯︵ ┻━┻',
	id: '256',
	relation: 'stranger',
	profileColor: 'bg-BE5103',
	language: 'English',
	status: true,
	username: 'm4p1',
	winstreak: '7',
	since: '145',
};

export const users: Array<types.UserData> = [user, u1, user, user, u1, user, user, u1, user];
export const u2: Array<types.UserData> = [u1, u1];

export const iMeta: types.ImgData = {
	alt: 'pp',
	id: 'user-avatar',
	size: 'imedium',
	src: '/public/assets/images/purple-avatar.png',
};

export const textData: types.InputFieldsData = {
	id: 'username',
	labelContent: 'Username',
	pattern: usernamePattern,
	placeholder: 'Enter your username!',
	type: 'text',
	required: false,
};

export const textArea: types.InputFieldsData = {
	id: 'Biography',
	labelContent: 'Biography',
	pattern: '',
	placeholder: 'Enter your biography',
	type: '',
	required: false,
};

export const uploadData: types.InputFieldsData = {
	id: 'upload',
	labelContent: 'Upload file',
	pattern: '',
	placeholder: 'Choose a file from your computer...',
	type: 'file',
	required: false,
};

export const pwData: types.InputFieldsData = {
	id: 'password',
	labelContent: 'Password',
	pattern: passwordPattern,
	placeholder: 'Enter your password!',
	type: 'password',
	required: false,
};

export const slider: types.InputFieldsData = {
	id: 'paddle-speed',
	labelContent: 'Paddle speed',
	max: '5',
	min: '0',
	pattern: '',
	placeholder: '',
	step: '1',
	type: 'range',
	required: false,
};

export const mout1: types.MatchOutcome = {
	date: '24.10.2025',
	opponent: 'DumbCamel',
	outcome: 'Win',
	score: '5-3',
	duration: "2'53",
	tournament: true,
};

export const mout2: types.MatchOutcome = {
	date: '24.10.2025',
	opponent: 'AnotherFuckingPlayer',
	outcome: 'loss',
	score: '5-3',
	duration: "0'53",
	tournament: false,
};

export const matchesHistory: types.MatchOutcome[] = [
	mout1,
	mout2,
	mout2,
	mout1,
	mout1,
	mout1,
	mout2,
	mout1,
	mout2,
	mout2,
	mout1,
	mout1,
	mout1,
	mout2,
	mout1,
	mout2,
	mout2,
	mout1,
	mout1,
	mout1,
	mout2,
	mout1,
	mout2,
	mout2,
	mout1,
	mout1,
	mout1,
	mout2,
	mout1,
	mout2,
	mout2,
	mout1,
	mout1,
	mout1,
	mout2,
	mout1,
	mout2,
	mout2,
	mout1,
	mout1,
	mout1,
	mout2,
	mout1,
	mout2,
	mout2,
	mout1,
	mout1,
	mout1,
	mout2,
	mout1,
	mout2,
	mout2,
	mout1,
	mout1,
	mout1,
	mout2,
	mout1,
	mout2,
	mout2,
	mout1,
	mout1,
	mout1,
	mout2,
];

export const m1: types.MatchParticipants = {
	player1: {
		avatar: {
			alt: 'pp',
			id: 'user-avatar',
			size: 'iicon',
			src: '/public/assets/images/magenta-avatar.png',
		},
		biography: '(╯°□°)╯︵ ┻━┻',
		id: '256',
		relation: 'stranger',
		profileColor: 'bg-CE4257',
		language: 'English',
		status: true,
		username: 'm1p1',
		winstreak: '7',
		since: '145',
	},
	player2: {
		avatar: {
			alt: 'pp',
			id: 'user-avatar',
			size: 'iicon',
			src: '/public/assets/images/light-green-avatar.png',
		},
		biography: '>:)',
		id: '64',
		relation: 'stranger',
		profileColor: 'bg-98A869',
		language: 'English',
		status: true,
		username: 'm1p2',
		winstreak: '4',
		since: '35',
	},
};

export const m2: types.MatchParticipants = {
	player1: {
		avatar: {
			alt: 'pp',
			id: 'user-avatar',
			size: 'iicon',
			src: '/public/assets/images/magenta-avatar.png',
		},
		biography: '(╯°□°)╯︵ ┻━┻',
		id: '256',
		relation: 'stranger',
		profileColor: 'bg-4F9FFF',
		language: 'English',
		status: true,
		username: 'm2p1',
		winstreak: '7',
		since: '145',
	},
	player2: {
		avatar: {
			alt: 'pp',
			id: 'user-avatar',
			size: 'iicon',
			src: '/public/assets/images/light-green-avatar.png',
		},
		biography: '>:)',
		id: '64',
		relation: 'stranger',
		profileColor: 'bg-5200FF',
		language: 'English',
		status: true,
		username: 'm2p2',
		winstreak: '4',
		since: '35',
	},
};

export const m3: types.MatchParticipants = {
	player1: {
		avatar: {
			alt: 'pp',
			id: 'user-avatar',
			size: 'iicon',
			src: '/public/assets/images/magenta-avatar.png',
		},
		biography: '(╯°□°)╯︵ ┻━┻',
		id: '256',
		relation: 'stranger',
		profileColor: 'bg-000080',
		language: 'English',
		status: true,
		username: 'm3p1',
		winstreak: '7',
		since: '145',
	},
	player2: {
		avatar: {
			alt: 'pp',
			id: 'user-avatar',
			size: 'iicon',
			src: '/public/assets/images/light-green-avatar.png',
		},
		biography: '>:)',
		id: '64',
		relation: 'stranger',
		profileColor: 'bg-98A869',
		language: 'English',
		status: true,
		username: 'm3p2',
		winstreak: '4',
		since: '35',
	},
};

export const m4: types.MatchParticipants = {
	player1: {
		avatar: {
			alt: 'pp',
			id: 'user-avatar',
			size: 'iicon',
			src: '/public/assets/images/magenta-avatar.png',
		},
		biography: '(╯°□°)╯︵ ┻━┻',
		id: '256',
		relation: 'stranger',
		profileColor: 'bg-BE5103',
		language: 'English',
		status: true,
		username: 'm4p1',
		winstreak: '7',
		since: '145',
	},
	player2: {
		avatar: {
			alt: 'pp',
			id: 'user-avatar',
			size: 'iicon',
			src: '/public/assets/images/light-green-avatar.png',
		},
		biography: '>:)',
		id: '64',
		relation: 'stranger',
		profileColor: 'bg-CE4257',
		language: 'English',
		status: true,
		username: 'm4p2',
		winstreak: '4',
		since: '35',
	},
};

export const r2m1: types.MatchParticipants = {
	player1: {
		avatar: {
			alt: 'pp',
			id: 'user-avatar',
			size: 'iicon',
			src: '/public/assets/images/magenta-avatar.png',
		},
		biography: '(╯°□°)╯︵ ┻━┻',
		id: '256',
		relation: 'stranger',
		profileColor: 'bg-4F9FFF',
		language: 'English',
		status: true,
		username: 'm2p1',
		winstreak: '7',
		since: '145',
	},
	player2: {
		avatar: {
			alt: 'pp',
			id: 'user-avatar',
			size: 'iicon',
			src: '/public/assets/images/magenta-avatar.png',
		},
		biography: '(╯°□°)╯︵ ┻━┻',
		id: '256',
		relation: 'stranger',
		profileColor: 'bg-CE4257',
		language: 'English',
		status: true,
		username: 'm1p1',
		winstreak: '7',
		since: '145',
	},
};

export const r2m2: types.MatchParticipants = {
	player1: {
		avatar: {
			alt: 'pp',
			id: 'user-avatar',
			size: 'iicon',
			src: '/public/assets/images/light-green-avatar.png',
		},
		biography: '>:)',
		id: '64',
		relation: 'stranger',
		profileColor: 'bg-98A869',
		language: 'English',
		status: true,
		username: 'm3p2',
		winstreak: '4',
		since: '35',
	},
	player2: {
		avatar: {
			alt: 'pp',
			id: 'user-avatar',
			size: 'iicon',
			src: '/public/assets/images/light-green-avatar.png',
		},
		biography: '>:)',
		id: '64',
		relation: 'stranger',
		profileColor: 'bg-CE4257',
		language: 'English',
		status: true,
		username: 'm4p2',
		winstreak: '4',
		since: '35',
	},
};

export const tournament: types.MatchParticipants[] = [m1, m2, m3, m4];
export const tournamentR2: types.MatchParticipants[] = [r2m1, r2m2];
