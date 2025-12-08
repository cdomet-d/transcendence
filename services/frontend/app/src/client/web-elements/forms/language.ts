import type { Dictionary } from '../types-interfaces.js';

// hardcoded this so the app renders instantly without waiting for a fetch for now, will do route calling in next branch
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
		logout: "Log out",
		start_game: "Start game",
		start_tournament: "Start tournament",
		delete_account: "Delete account",
		download_data: "Download personal data"
	},
	forms: {
		username: "Username",
		password: "Password",
		biography: "Biography",
		avatar: "Avatar",
		search_placeholder: "Search...",
		avatar_uploader: "Avatar uploader"
	},
	titles: {
		settings: "Settings",
		register: "Register",
		login: "Login",
		local_pong: "Local Pong",
		remote_pong: "Remote Pong",
		tournament: "Tournament",
		leaderboard: "Leaderboard",
		home: "Home",
		pong_tournament: "Pong Tournament",
		choose_lobby: "Choose Lobby"
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
		under_water: "Under Water",
		opponent_name: "Opponent Nickname",
		choose_back: "Select background",
		searchbar: "Searchbar"
	},
	error: {
		username_error: "Invalid username or password.",
		password_error: "Password must be at least 8 characters.",
		page404: "There's nothing here :<",
		uppercase: "missing an uppercase letter",
		lowercase: "missing an lowercase letter",
		number: "missing an number",
		special_char: "missing a special character",
		pass_lenght: "Password should be 12-64 characters long, is",
		forbidden: "Forbidden character",
		username_lenght: "Username should be ",
		username_lenght2: " -18 character long, is ",
		file_heavy: "That file is too heavy: max is 2MB!",
		file_extension: "Invalid extension: ",

	},
	lobby: {
		local: "Local 1v1",
		remote: "Remote 1v1",
		tournament: "Tournament"
	},
	placeholders: {
		enter_password: "Enter your password!",
		enter_username: "Enter your username!",
		enter_biography: "Enter your biography",
		upload_file: "Choose a file from your computer..."
	},
	settings: {
		pick_color: "Pick color",
		pick_language: "Pick language",
		en: "English",
		fr: "French",
		es: "Spanish"
	}
};

export let currentDictionary: Dictionary = defaultDictionary;
export let currentLanguage: string = 'en';

export async function setLanguage(lang: string): Promise<void> {
	try {
		const response = await fetch(`https://localhost:8443/api/bff/dictionary/${lang}`);

		if (!response.ok) {

		}
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

export async  function initLanguage() {
	const savedLang = localStorage.getItem('preferred_language') || 'fr';
	if (savedLang !== 'en')
		await setLanguage("fr");
}