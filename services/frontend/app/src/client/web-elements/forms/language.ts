//import { tournament } from '../default-values.js';
import type { Dictionary } from '../types-interfaces.js';

// TODO hardcoded this so the app renders instantly without waiting for a fetch for now, will do route calling in next branch
export const defaultDictionary: Dictionary = {
	buttons: {
		submit: "Submit",
		cancel: "Cancel",
		search: "Search",
		delete: "Delete",
		decline: "Decline",
		play: "Play",
		leaderboard: "Leaderboard",
		profile: "Profile",
		login: "Log in",
		logout: "Log out"
	},
	forms: {
		username: "Username",
		password: "Password",
		biography: "Biography",
		avatar: "Avatar",
		search_placeholder: "Search..."
	},
	titles: {
		settings: "Settings",
		register: "Register",
		login: "Login",
		local_pong: "Local Pong",
		remote_pong: "Remote Pong",
		tournament: "Tournament",
		leaderboard: "Leaderboard",
		home: "Home"
	},
	profile: {
		joined: "Joined",
		friends: "Friends",
		game_history: "Game History",
		statistics: "Statistics",
		date: "Date",
		opponent: "Opponent",
		outcome: "Outcome",
		score: "Score",
		duration: "Duration",
		tournament: "Tournament"
	},
	notifs: {
		notif_placeholder: "No new notifications"
	},
	gameCustom: {
		ball_speed: "Starting Ball Speed",
		paddle_size: "Paddle Size",
		paddle_speed: "Paddle Speed",
		paddle_horizontal: "Horizontal Movement",
		opponent: "Opponent",
		start: "Start Game",
		local: "Local",
		remote: "Remote",
		background: "Background",
		farm: "Farm",
		forest: "Forest",
		under_water: "Under Water"
	},
	error: {
		username_error: "Invalid username or password.",
		password_error: "Password must be at least 8 characters."
	},
	lobby: {
		local: "Local 1v1",
		remote: "Remote 1v1",
		tournament: "Tournament"
	}
};
export let currentDictionary: Dictionary = defaultDictionary;
export let currentLanguage: string = 'en';

export async function setLanguage(lang: string): Promise<void> {
	try {
		const response = await fetch(`https://localhost:8443/api/bff/dictionary/${lang}`);

		//TODO handle error
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
	const savedLang = localStorage.getItem('preferred_language') || 'es';
	if (savedLang !== 'en')
		setLanguage(savedLang);
}