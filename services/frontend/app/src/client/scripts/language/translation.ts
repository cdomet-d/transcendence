import English from '../../assets/locales/en.json' with { type: "json" };
import French from '../../assets/locales/fr.json' with { type: "json" };
import Spanish from '../../assets/locales/es.json' with { type: "json" };

type TranslationMap = Record<string, string>;

const resources: Record<string, TranslationMap> = { English, French, Spanish };
export let currentLang: string = "English";
let translation: TranslationMap = English;

export function initLanguageCSR() {
	let savedLang: string | null = localStorage.getItem('selectedLanguage');
	if (!savedLang)
		savedLang = "English";
	setLangVars(savedLang);
}

export function setLangVars(savedLang: string) {
	if (resources[savedLang]) {
		currentLang = savedLang;
		translation = resources[savedLang];
	}
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
