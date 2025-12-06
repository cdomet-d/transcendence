import type { FormDetails, UserData } from '../types-interfaces.js';
import type { Dictionary } from '../types-interfaces.js';
import { usernamePattern, passwordPattern, searchbarPattern } from '../default-values.js';

//TODO: HTML froms don't support patch must come up with a way to identify which POST are actually POST and which are patch, to be handled in the server.

//TODO language
export function userSettingsForm(dic: Dictionary, user?: UserData): FormDetails {
	return {
		action: 'https://localhost:8443/api/bff/settings',
		heading: dic.titles.settings,
		ariaLabel: 'User settings',
		id: 'user-settings',
		method: 'PATCH',
		fields: [
			{
				id: 'upload',
				labelContent: dic.forms.avatar_uploader,
				pattern: '',
				placeholder: '',
				type: 'file',
				required: false,
			},
			{
				id: 'biography',
				labelContent: dic.forms.biography,
				pattern: '',
				//TODO add placeholder
				placeholder: user?.biography || '',
				type: 'textarea',
				required: false,
			},
			{
				id: 'username',
				labelContent: dic.forms.username,
				pattern: usernamePattern,
				//TODO add placeholder
				placeholder: user?.username || 'Enter your new username!',
				type: 'text',
				required: false,
			},
			{
				id: 'password',
				labelContent: dic.forms.password,
				pattern: passwordPattern,
				placeholder: 'Enter your new password!',
				type: 'password',
				required: false,
			},
		],
		//TODO Language
		button: {
			id: 'submit',
			type: 'submit',
			content: dic.buttons.submit,
			img: null,
			ariaLabel: '',
		},
	};
}

export function registrationForm(dic: Dictionary): FormDetails {
	console.log('IN REGISTREATION FORM', JSON.stringify(dic));
	return {
		action: 'https://localhost:8443/api/auth/register',
		heading: dic.titles.register,
		ariaLabel: 'Create an account',
		id: 'account-create',
		method: 'POST',
		fields: [
			{
				id: 'username',
				labelContent: dic.forms.username,
				pattern: usernamePattern,
				placeholder: dic.placeholders.enter_username,
				type: 'text',
				required: true,
			},
			{
				id: 'password',
				labelContent: dic.forms.password,
				pattern: passwordPattern,
				placeholder: dic.placeholders.enter_password,
				type: 'password',
				required: false,
			},
		],
		button: {
			id: 'submit',
			type: 'submit',
			content: dic.buttons.submit,
			img: null,
			ariaLabel: '',
		},
	};
}

export function loginForm(dic: Dictionary): FormDetails {
	return {
		action: 'https://localhost:8443/api/auth/login',
		heading: dic.titles.login,
		ariaLabel: 'Log into an account',
		id: 'account-login',
		method: 'POST',
		fields: [
			{
				id: 'username',
				labelContent: dic.forms.username,
				pattern: usernamePattern,
				placeholder: dic.placeholders.enter_username,
				type: 'text',
				required: true,
			},
			{
				id: 'password',
				labelContent: dic.forms.password,
				pattern: passwordPattern,
				placeholder: dic.placeholders.enter_password,
				type: 'password',
				required: false,
			},
		],
		button: {
			id: 'submit',
			type: 'submit',
			content: dic.buttons.submit,
			img: null,
			ariaLabel: '',
		},
	};
}

export function search(dic: Dictionary): FormDetails {
	return {
		action: 'https://localhost:8443/api/bff/search?name=',
		heading: '',
		ariaLabel: 'Search for a user',
		id: 'searchform',
		method: 'get',
		fields: [
			{
				id: 'searchbar',
				labelContent: 'Searchbar',
				pattern: searchbarPattern,
				placeholder: currentDictionary.gameCustom.searchbar,
				type: 'text',
				required: true,
			},
		],
		button: {
			id: 'submit',
			type: 'submit',
			content: dic.buttons.search,
			img: null,
			ariaLabel: '',
		},
	};
}

export function localPong(dic: Dictionary): FormDetails {
	return {
		action: 'https://localhost:8443/api/game/quick-lobby/',
		heading: dic.gameCustom.local,
		gameFormat: 'local-quickmatch',
		ariaLabel: 'Pong settings',
		id: 'local-pong-settings',
		method: 'POST',
		fields: [
			{
				id: 'ballspeed',
				labelContent: dic.gameCustom.ball_speed,
				max: '5',
				min: '0',
				pattern: '',
				placeholder: '',
				required: true,
				step: '1',
				type: 'range',
			},
			{
				id: 'horizontal',
				labelContent: dic.gameCustom.paddle_speed,
				pattern: '',
				placeholder: '',
				type: 'checkbox',
				required: true,
			},
			{
				id: 'paddlesize',
				labelContent: dic.gameCustom.paddle_size,
				max: '5',
				min: '0',
				pattern: '',
				placeholder: '',
				required: true,
				step: '1',
				type: 'range',
			},
			{
				id: 'opponent',
				labelContent: dic.gameCustom.opponent_name,
				pattern: usernamePattern,
				placeholder: dic.gameCustom.opponent,
				type: 'text',
				required: true,
			},
			{
				id: 'paddlespeed',
				labelContent: dic.gameCustom.paddle_speed,
				max: '5',
				min: '0',
				pattern: '',
				placeholder: '',
				required: true,
				step: '1',
				type: 'range',
			},
		],
		button: {
			id: 'submit',
			type: 'submit',
			content: dic.buttons.start_game,
			img: null,
			ariaLabel: '',
		},
	};
}

export function remotePong(dic: Dictionary): FormDetails {
	return {
		action: 'https://localhost:8443/api/game/quick-lobby/',
		heading: 'Remote Pong',
		gameFormat: 'remote-quickmatch',
		ariaLabel: 'Remote Pong settings',
		id: 'remote-pong-settings',
		method: 'POST',
		fields: [
			{
				id: 'horizontal',
				labelContent: dic.gameCustom.paddle_horizontal,
				pattern: '',
				placeholder: '',
				type: 'checkbox',
				required: true,
			},
			{
				id: 'ballspeed',
				labelContent: dic.gameCustom.ball_speed,
				max: '5',
				min: '0',
				pattern: '',
				placeholder: '',
				required: true,
				step: '1',
				type: 'range',
			},
			{
				id: 'paddlesize',
				labelContent: dic.gameCustom.paddle_size,
				max: '5',
				min: '0',
				pattern: '',
				placeholder: '',
				required: true,
				step: '1',
				type: 'range',
			},
			{
				id: 'paddlespeed',
				labelContent: dic.gameCustom.paddle_speed,
				max: '5',
				min: '0',
				pattern: '',
				placeholder: '',
				required: true,
				step: '1',
				type: 'range',
			},
		],
		button: {
			id: 'submit',
			type: 'submit',
			content: dic.buttons.start_game,
			img: null,
			ariaLabel: '',
		},
	};
}

export function pongTournament(dic: Dictionary): FormDetails {
	return {
		action: 'https://localhost:8443/api/game/tournament-lobby/',
		heading: dic.titles.pong_tournament,
		gameFormat: 'tournament',
		ariaLabel: 'Pong tournament settings',
		id: 'pong-tournament-settings',
		method: 'POST',
		fields: [
			{
				id: 'ballspeed',
				labelContent: dic.gameCustom.ball_speed,
				max: '5',
				min: '0',
				pattern: '',
				placeholder: '',
				required: true,
				step: '1',
				type: 'range',
			},
			{
				id: 'paddlesize',
				labelContent: dic.gameCustom.paddle_size,
				max: '5',
				min: '0',
				pattern: '',
				placeholder: '',
				required: true,
				step: '1',
				type: 'range',
			},
			{
				id: 'paddlespeed',
				labelContent: dic.gameCustom.paddle_speed,
				max: '5',
				min: '0',
				pattern: '',
				placeholder: '',
				required: true,
				step: '1',
				type: 'range',
			},
		],
		button: {
			id: 'submit',
			type: 'submit',
			content: dic.buttons.start_tournament,
			img: null,
			ariaLabel: '',
		},
	};
}

export function deleteAccount(dic: Dictionary): FormDetails {
	return {
		action: 'https://localhost:8443/api/bff/account',
		heading: '',
		ariaLabel: 'Account deletion request',
		id: 'account-deletion-request',
		method: 'delete',
		fields: [],
		button: {
			id: 'submit',
			type: 'submit',
			content: dic.buttons.delete_account,
			img: null,
			ariaLabel: '',
			style: 'red',
		},
	}
};

export const criticalChange: FormDetails = {
	action: 'https://localhost:8443/api/auth/verify',
	heading: 'Password Required',
	ariaLabel: 'Verify your password',
	id: 'pw-check',
	method: 'POST',
	fields: [
		{
			id: 'password',
			labelContent: 'Password',
			pattern: passwordPattern,
			placeholder: 'Enter your password!',
			type: 'password',
			required: true,
		},
	],
	button: { id: 'submit', type: 'submit', content: 'submit', img: null, ariaLabel: '' },
};
