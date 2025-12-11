import type { FormDetails, UserData } from '../types-interfaces.js';
import { usernamePattern, passwordPattern, searchbarPattern } from '../default-values.js';
import { currentDictionary } from './language.js';
import { origin } from '../../main.js';

export function userSettingsForm(user?: UserData): FormDetails {
	return {
		action: `https://${origin}:8443/api/bff/settings`,
		heading: currentDictionary.titles.settings,
		ariaLabel: 'User settings',
		id: 'user-settings',
		method: 'PATCH',
		fields: [
			{
				id: 'upload',
				labelContent: currentDictionary.forms.avatar_uploader,
				pattern: '',
				placeholder: '',
				type: 'file',
				required: false,
			},
			{
				id: 'biography',
				labelContent: currentDictionary.forms.biography,
				pattern: '',
				placeholder: user?.biography || 'Enter your new biography!',
				type: 'textarea',
				required: false,
			},
			{
				id: 'username',
				labelContent: currentDictionary.forms.username,
				pattern: usernamePattern,
				placeholder: user?.username || currentDictionary.placeholders.enter_username,
				type: 'text',
				required: false,
			},
			{
				id: 'password',
				labelContent: currentDictionary.forms.password,
				pattern: passwordPattern,
				placeholder: currentDictionary.placeholders.enter_password,
				type: 'password',
				required: false,
			},
		],
		button: {
			id: 'submit',
			type: 'submit',
			content: currentDictionary.buttons.submit,
			img: null,
			ariaLabel: '',
		},
	};
}

export function registrationForm(): FormDetails {
	return {
		action: `https://${origin}:8443/api/auth/register`,
		heading: currentDictionary.titles.register,
		ariaLabel: 'Create an account',
		id: 'account-create',
		method: 'POST',
		fields: [
			{
				id: 'username',
				labelContent: currentDictionary.forms.username,
				pattern: usernamePattern,
				placeholder: currentDictionary.placeholders.enter_username,
				type: 'text',
				required: true,
			},
			{
				id: 'password',
				labelContent: currentDictionary.forms.password,
				pattern: passwordPattern,
				placeholder: currentDictionary.placeholders.enter_password,
				type: 'password',
				required: false,
			},
		],
		button: {
			id: 'submit',
			type: 'submit',
			content: currentDictionary.buttons.submit,
			img: null,
			ariaLabel: '',
		},
	};
}

export function loginForm(): FormDetails {
	return {
		action: `https://${origin}:8443/api/auth/login`,
		heading: currentDictionary.titles.login,
		ariaLabel: 'Log into an account',
		id: 'account-login',
		method: 'POST',
		fields: [
			{
				id: 'username',
				labelContent: currentDictionary.forms.username,
				pattern: usernamePattern,
				placeholder: currentDictionary.placeholders.enter_username,
				type: 'text',
				required: true,
			},
			{
				id: 'password',
				labelContent: currentDictionary.forms.password,
				pattern: passwordPattern,
				placeholder: currentDictionary.placeholders.enter_password,
				type: 'password',
				required: false,
			},
		],
		button: {
			id: 'submit',
			type: 'submit',
			content: currentDictionary.buttons.submit,
			img: null,
			ariaLabel: '',
		},
	};
}

export function search(): FormDetails {
	return {
		action: `https://${origin}:8443/api/bff/search?name=`,
		heading: '',
		ariaLabel: 'Search for a user',
		id: 'searchform',
		method: 'get',
		fields: [
			{
				id: 'searchbar',
				labelContent: currentDictionary.buttons.search,
				pattern: searchbarPattern,
				placeholder: currentDictionary.gameCustom.searchbar,
				type: 'text',
				required: true,
			},
		],
		button: {
			id: 'submit',
			type: 'submit',
			content: currentDictionary.buttons.search,
			img: null,
			ariaLabel: '',
		},
	};
}

export function localPong(): FormDetails {
	return {
		action: `https://${origin}:8443/api/game/quick-lobby/`,
		heading: currentDictionary.gameCustom.local,
		gameFormat: 'local-quickmatch',
		ariaLabel: 'Pong settings',
		id: 'local-pong-settings',
		method: 'POST',
		fields: [
			{
				id: 'ballspeed',
				labelContent: currentDictionary.gameCustom.ball_speed,
				max: '2',
				min: '0',
				pattern: '',
				placeholder: '',
				required: true,
				step: '1',
				type: 'range',
			},
			{
				id: 'horizontal',
				labelContent: currentDictionary.gameCustom.paddle_horizontal,
				pattern: '',
				placeholder: '',
				type: 'checkbox',
				required: true,
			},
			{
				id: 'paddlesize',
				labelContent: currentDictionary.gameCustom.paddle_size,
				max: '2',
				min: '0',
				pattern: '',
				placeholder: '',
				required: true,
				step: '1',
				type: 'range',
			},
			{
				id: 'opponent',
				labelContent: currentDictionary.gameCustom.opponent,
				pattern: usernamePattern,
				placeholder: currentDictionary.gameCustom.opponent,
				type: 'text',
				required: true,
			},
			{
				id: 'paddlespeed',
				labelContent: currentDictionary.gameCustom.paddle_speed,
				max: '2',
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
			content: currentDictionary.buttons.start_game,
			img: null,
			ariaLabel: '',
		},
	};
}

export function remotePong(): FormDetails {
	return {
		action: `https://${origin}:8443/api/game/quick-lobby/`,
		heading: 'Remote Pong',
		gameFormat: 'remote-quickmatch',
		ariaLabel: 'Remote Pong settings',
		id: 'remote-pong-settings',
		method: 'POST',
		fields: [
			{
				id: 'horizontal',
				labelContent: currentDictionary.gameCustom.paddle_horizontal,
				pattern: '',
				placeholder: '',
				type: 'checkbox',
				required: true,
			},
			{
				id: 'ballspeed',
				labelContent: currentDictionary.gameCustom.ball_speed,
				max: '2',
				min: '0',
				pattern: '',
				placeholder: '',
				required: true,
				step: '1',
				type: 'range',
			},
			{
				id: 'paddlesize',
				labelContent: currentDictionary.gameCustom.paddle_size,
				max: '2',
				min: '0',
				pattern: '',
				placeholder: '',
				required: true,
				step: '1',
				type: 'range',
			},
			{
				id: 'paddlespeed',
				labelContent: currentDictionary.gameCustom.paddle_speed,
				max: '2',
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
			content: currentDictionary.buttons.start_game,
			img: null,
			ariaLabel: '',
		},
	};
}

export function pongTournament(): FormDetails {
	return {
		action: `https://${origin}:8443/api/game/tournament-lobby/`,
		heading: currentDictionary.titles.pong_tournament,
		gameFormat: 'tournament',
		ariaLabel: 'Pong tournament settings',
		id: 'pong-tournament-settings',
		method: 'POST',
		fields: [
			{
				id: 'horizontal',
				labelContent: currentDictionary.gameCustom.paddle_horizontal,
				pattern: '',
				placeholder: '',
				type: 'checkbox',
				required: true,
			},
			{
				id: 'ballspeed',
				labelContent: currentDictionary.gameCustom.ball_speed,
				max: '2',
				min: '0',
				pattern: '',
				placeholder: '',
				required: true,
				step: '1',
				type: 'range',
			},
			{
				id: 'paddlesize',
				labelContent: currentDictionary.gameCustom.paddle_size,
				max: '2',
				min: '0',
				pattern: '',
				placeholder: '',
				required: true,
				step: '1',
				type: 'range',
			},
			{
				id: 'paddlespeed',
				labelContent: currentDictionary.gameCustom.paddle_speed,
				max: '2',
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
			content: currentDictionary.buttons.start_tournament,
			img: null,
			ariaLabel: '',
		},
	};
}

export function deleteAccount(): FormDetails {
	return {
		action: `https://${origin}:8443/api/bff/account`,
		heading: '',
		ariaLabel: 'Account deletion request',
		id: 'account-deletion-request',
		method: 'delete',
		fields: [],
		button: {
			id: 'submit',
			type: 'submit',
			content: currentDictionary.buttons.delete_account,
			img: null,
			ariaLabel: '',
			style: 'red',
		},
	}
};

export function downloadData(): FormDetails {
	return {
		action: `https://${origin}:8443/api/bff/data`,
		heading: '',
		ariaLabel: 'Download personal data request',
		id: 'download-data-request',
		method: 'get',
		fields: [],
		button: {
			id: 'submit',
			type: 'submit',
			content: currentDictionary.buttons.download_data,
			img: null,
			ariaLabel: '',
		},
	}
};

export function criticalChange(): FormDetails {
	return {
		action: `https://${origin}:8443/api/auth/verify`,
		heading: 'Password Required',
		ariaLabel: 'Verify your password',
		id: 'pw-check',
		method: 'POST',
		fields: [
			{
				id: 'password',
				labelContent: 'Password',
				pattern: passwordPattern,
				placeholder: currentDictionary.placeholders.enter_password,
				type: 'password',
				required: true,
			},
		],
		button: { id: 'submit', type: 'submit', content: 'submit', img: null, ariaLabel: '' },
	}
};

export function privacyButton(): FormDetails {
	return {
		action: '/privacy',
		heading: '',
		ariaLabel: 'Privacy Policy',
		id: 'privacy-button-form',
		method: 'get',
		fields: [],
		button: {
			id: 'submit',
			type: 'submit',
			content: currentDictionary.buttons.privacy,
			img: null,
			ariaLabel: 'Go to privacy policy',
		},
	}
};
