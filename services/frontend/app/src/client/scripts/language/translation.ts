import en from '../../../assets/locales/en.json' with { type: "json" };
import fr from '../../../assets/locales/fr.json' with { type: "json" };
import es from '../../../assets/locales/es.json' with { type: "json" };

type TranslationMap = Record<string, string>;

export let currentLang: string = "en";
const resources: Record<string, TranslationMap> = { en ,fr, es };
let translation: TranslationMap;

export function initLanguageCSR() {
	const savedLang = localStorage.getItem('selectedLanguage');
	if (savedLang && resources[savedLang]) {
		currentLang = savedLang;
	} else {
		currentLang = 'en';
	}
	translation = resources[currentLang] ?? {};
}

export function translate(key: string): string {
	return (translation[key] || key);
}

export function changeLanguage(lang: string) {
	if (resources[lang]) {
		currentLang = lang;
		translation = resources[lang];
		localStorage.setItem('selectedLanguage', lang);
		document.cookie = `lang=${lang};path=/;max-age=31536000`;
	}
}

export function initLanguageSSR(savedLang: string) {
	if (savedLang && resources[savedLang]) {
		currentLang = savedLang;
	} else {
		currentLang = 'en';
	}
	translation = resources[savedLang] ?? {};
}
