console.log("i18n module loaded", import.meta.url, Math.random());

import en from '../../../assets/locales/en.json' with { type: "json" };
import fr from '../../../assets/locales/fr.json' with { type: "json" };
import es from '../../../assets/locales/es.json' with { type: "json" };

export type TranlationMap = Record<string, string>;

export let currentLang: string = "en";
export const resources: Record<string, TranlationMap> = { en ,fr, es };
export let translation: TranlationMap /*= resources["en"]*/;

export function initLanguageClient() {
	const savedLang = localStorage.getItem('selectedLanguage');
	console.log("savedLang:", savedLang);
	if (savedLang && resources[savedLang]) {
		currentLang = savedLang;
	} else {
		currentLang = 'en';
	}
	translation = resources[currentLang] ?? {};
	// console.log("translation:", translation);
	// console.log("currentLang", currentLang);
}

export function translate(key: string): string {
	// console.log("translation in translate", translation);
	return (translation[key] || key);
}

export function changeLanguage(lang: string) {
	if (resources[lang]) {
		currentLang = lang;
		translation = resources[lang];
		localStorage.setItem('selectedLanguage', lang);
		document.cookie = `lang=${lang};path=/;max-age=31536000`;
	}
	// console.log("translation in changeLanguage", translation);
	// console.log("currentLang in changeLanguage", currentLang);
}

export function setTranslation(savedLang: string) {
	if (savedLang && resources[savedLang]) {
		currentLang = savedLang;
	} else {
		currentLang = 'en';
	}
	translation = resources[savedLang] ?? {};
}
