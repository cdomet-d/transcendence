import * as types from './types-interfaces.js';
import type { Dictionary } from './types-interfaces.js';
import winscreen from '../assets/images/pong-win-screen.gif';
import loosescreen from '../assets/images/pong-loose-screen.gif';

export const biographyPattern: string = '^[A-Za-z0-9\\s,\\.\\?!:\\)\\(\\/\\-_]{0,256}$';
export const passwordPattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[a-zA-Z0-9@$!%*?&]{12,64}$';
export const usernamePattern: string = '^[A-Za-z0-9]{4,18}$';
export const searchbarPattern: string = '^[A-Za-z0-9]{0,18}$';

export const looseImage: types.ImgData = {
	src: loosescreen,
	id: 'looseGif',
	size: 'i3xl',
	alt: ' An image of small blob getting rained on in pixel-art style',
};

export const winImage: types.ImgData = {
	src: winscreen,
	id: 'winGif',
	size: 'i3xl',
	alt: ' An image of small blob dancing in stars in pixel-art style',
};

export const user: types.UserData = {
	avatar: {
		alt: 'pp',
		id: 'user-avatar',
		size: 'ixl',
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

export function textData(dic: Dictionary): types.InputFieldsData {
	return {
		id: 'username',
		labelContent: 'Username',
		pattern: usernamePattern,
		placeholder: dic.placeholders.enter_username,
		type: 'text',
		required: false,
	};
}

export function textArea(dic: Dictionary): types.InputFieldsData {
	return {
		id: 'Biography',
		labelContent: 'Biography',
		pattern: '',
		placeholder: dic.placeholders.enter_biography,
		type: '',
		required: false,
	};
}

export function uploadData(dic: Dictionary): types.InputFieldsData {
	return {
		id: 'upload',
		labelContent: 'Upload file',
		pattern: '',
		placeholder: dic.placeholders.upload_file,
		type: 'file',
		required: false,
	};
}

export function pwData(dic: Dictionary): types.InputFieldsData {
	return {
		id: 'password',
		labelContent: 'Password',
		pattern: passwordPattern,
		placeholder: dic.placeholders.enter_password,
		type: 'password',
		required: false,
	};
}
