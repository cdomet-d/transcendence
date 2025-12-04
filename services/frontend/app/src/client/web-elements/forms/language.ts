import type { Dictionary } from '../types-interfaces.js';

// TODO hardcoded this so the app renders instantly without waiting for a fetch for now, will do route calling in next branch
export const defaultDictionary: Dictionary = {
	common: {
		submit: "Submit",
		cancel: "Cancel",
		search: "Search",
		delete: "Delete"
	},
	forms: {
		username: "Username",
		password: "Password",
		biography: "Biography",
		avatar: "Avatar",
		search_placeholder: "Search..."
	},
	game: {
		ball_speed: "Starting ball speed",
		paddle_size: "Paddle size",
		paddle_speed: "Paddle Speed",
		opponent: "Opponent",
		start: "Start Game",
		local: "Locale",
		remote: "Remote"
	},
	titles: {
		settings: "Settings",
		register: "Register",
		login: "Login",
		local_pong: "Local Pong",
		remote_pong: "Remote Pong",
		tournament: "Tournament"
	}
};

export let currentDictionary: Dictionary = defaultDictionary;
export let currentLanguage: string = 'en';

export async function setLanguage(lang: string): Promise<void> {
	try {
		//TODO fetch to bff
		const response = await fetch(`https://localhost:8443/api/bff/dictionary/${lang}`);

		//TODO error handling
		if (!response.ok)
			throw new Error(`Failed to load language: ${lang}`);

		const newDict = (await response.json()) as Dictionary;

		currentDictionary = newDict;
		currentLanguage = lang;

		localStorage.setItem('preferred_language', lang);

		document.dispatchEvent(new CustomEvent('language-changed', { detail: { lang } }));

		console.log(`[LANG] Switched to ${lang}`);

	} catch (error) {
		console.error('[LANG] Error loading language pack:', error);
	}
}

export function initLanguage() {
	//const savedLang = localStorage.getItem('preferred_language') || 'fr';
	const savedLang = "fr"
	if (savedLang === 'fr') {
		setLanguage(savedLang);
	}
}