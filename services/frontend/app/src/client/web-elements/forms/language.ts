import type { Dictionary } from '../types-interfaces.js';
import { createVisualFeedback } from '../../error.js';
import { errorMessageFromException } from '../../error.js';

export const defaultDictionary: Dictionary = {
	privacy: {
		mainTitle: "GDPR Compliance & Data Privacy",
		storageTitle: "What We Store",
		rightsTitles: "Your Rights",
		intro: "We value your privacy. In compliance with the General Data Protection Regulation (GDPR),\
			this page outlines exactly what data we store, why we store it, and your rights regarding that data.",
		identity: '<strong>Identity:</strong> Username, avatar image, and biography to display your profile to other players.',
		auth: '<strong>Authentication:</strong> Securely hashed passwords. We never store your actual password.', 
		history: '<strong>Game History:</strong> Statistics (Wins, Losses, Streaks) and a log of matches played to populate leaderboards and history.',
		social: '<strong>Social:</strong> Your list of friends and pending friend requests.',
		sessionData: '<strong>Session Data:</strong> We use a secure HTTP-only cookie (JWT) to keep you logged in. \
			We do not use third-party tracking cookies. \
			In that cookie, we store your userID (that we generate) and your username (that we set) so we can render your informations on the website.\
			That cookie expires on its own after an hour.',
		access: '<strong>Right to Access (Portability):</strong> You can download a full copy of your personal data in JSON format via the User Settings page.',
		erasure: '<strong>Right to Erasure (Right to be Forgotten):</strong> You can delete your account at any time. \
		This process is permanent and irreversibly anonymizes your data (replacing your username/avatar with generic placeholders) \
		while preserving game statistics for fair history.',
		rectify: '<strong>Right to Rectification:</strong> You can update your profile information (username, bio, avatar, language) at any time.',
	},
	buttons: {
		submit: "Submit",
		cancel: "Cancel",
		search: "Search",
		delete: "Delete",
		decline: "Decline",
		accept: "Accept",
		play: "Play",
		leaderboard: "Leaderboard",
		profile: "Profile",
		login: "Log in",
		logout: "Log out",
		start_game: "Start game",
		start_tournament: "Start tournament",
		delete_account: "Delete account",
		download_data: "Download personal data",
		privacy: "Privacy policy",
		go_home: "Go home",
		downloaded: "Data downloaded"
	},
	forms: {
		username: 'Username',
		password: 'Password',
		biography: 'Biography',
		avatar: 'Avatar',
		searchbar: 'Searchbar',
		search_placeholder: 'Search...',
		avatar_uploader: 'Avatar uploader',
	},
	titles: {
		settings: 'Settings',
		register: 'Register',
		login: 'Login',
		local_pong: 'Local Pong',
		remote_pong: 'Remote Pong',
		tournament: 'Tournament',
		leaderboard: 'Leaderboard',
		home: 'Home',
		pong_tournament: 'Pong Tournament',
		choose_lobby: 'Choose Lobby',
	},
	profile: {
		joined: 'Joined',
		friends: 'Friends',
		game_history: 'Game History',
		statistics: 'Statistics',
		date: 'Date',
		opponent: 'Opponent',
		outcome: 'Outcome',
		score: 'Score',
		duration: 'Duration',
		tournament: 'Tournament',
	},
	notifs: {
		notif_placeholder: "No new notifications",
		notif_friends: "sent you a friend request!",
		notif_match: " challenged you to a ",
	},
	gameCustom: {
		ball_speed: "Starting Ball Speed",
		paddle_size: "Paddle Size",
		paddle_speed: "Paddle Speed",
		paddle_horizontal: "Horizontal",
		opponent: "Opponent",
		start: "Start Game",
		local: "Local",
		remote: "Remote",
		background: "Background",
		farm: "Adorable Farm",
		under_water: "Magical ocean",
		opponent_name: "Opponent Nickname",
		choose_back: "Select background",
		searchbar: "Searchbar"
	},
	error: {
		username_error: 'Invalid username or password.',
		password_error: 'Password must be at least 8 characters.',
		forbidden_error: 'Forbidden character: ',
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
		join_lobby: "Uh-oh! You can't be there - go join a lobby or something !",
		invite_lobby: "You were not invited to this lobby!",
		deleted_lobby: "The lobby you are trying to join does not exist anymore!",
		broke_lobby: "Your lobby is malfunctionning! Please create a new one!",
		nbplayers_lobby: "You do not have enough players in your lobby to start playing!",
		account_deleted: "Account permanently deleted",
		bad_request: "Bad Request",
		unauthorized: "Unauthorized",
		conflict: "Conflict: Resource already exists",
		redirection: "Redirected: You must be registered to see this page!",
		something_wrong: "Something went wrong",
		no_user: "No such user",
		login_lobby: "You are not logged in and thus cannot join a lobby!",
		too_many_players: "You can't invite any more people!",
		invite_yourself: "You can't invite yourself, dummy",
		times_up: "Time's up!!"
	},
	lobby: {
		local: 'Local 1v1',
		remote: 'Remote 1v1',
		tournament: 'Tournament',
	},
	placeholders: {
		enter_password: 'Enter your password!',
		enter_username: 'Enter your username!',
		enter_biography: 'Enter your biography',
		upload_file: 'Choose a file from your computer...',
	},
	settings: {
		pick_color: "Pick color",
		pick_language: "Pick language",
	},
	match_history: {
		date: "date",
		opponent: "opponent",
		outcome: "outcome",
		score: "score",
		duration: "duration",
		tournament: "game mode",
	}
};

export let currentDictionary: Dictionary = defaultDictionary;
export let currentLanguage: string = 'English';

export async function setLanguage(lang: string): Promise<void> {
	try {
		const response = await fetch(`https://${API_URL}:8443/api/bff/dictionary/${lang}`);
		if (!response.ok) {
			console.warn(`[LANG] Fetch failed for ${lang}. Status: ${response.status}. Reverting to default.`);
			currentDictionary = defaultDictionary;
			currentLanguage = 'English';
			document.dispatchEvent(new CustomEvent('language-changed', { detail: { lang: 'English' } }));
			createVisualFeedback(errorMessageFromException(`[LANG] Fetch failed for ${lang}. Status: ${response.status}. Reverting to default.`));
			return;
		}

		const newDict = (await response.json()) as Dictionary;
		currentDictionary = newDict;
		currentLanguage = lang;
		localStorage.setItem('preferred_language', lang);
		document.dispatchEvent(new CustomEvent('language-changed', { detail: { lang } }));
		console.log(`[LANG] Switched to ${lang}`);
	} catch (error) {
		console.error('[LANG] Network error loading language pack:', error);

		currentDictionary = defaultDictionary;
		currentLanguage = 'English';
		document.dispatchEvent(new CustomEvent('language-changed', { detail: { lang: 'English' } }));
	}
}

export async function initLanguage() {
	let savedLang = localStorage.getItem('preferred_language');
	if (!savedLang) savedLang = 'English'
	if (savedLang !== "English")
		await setLanguage(savedLang);
	else
		currentDictionary = defaultDictionary;
}
