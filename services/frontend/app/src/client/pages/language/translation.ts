type TranlationMap = Record<string, string>;

let translation: TranlationMap = {};
export let currentLang: string = "en";

import en from '../../assets/locales/en.json' with { type: "json" };
import fr from '../../assets/locales/fr.json' with { type: "json" };
import es from '../../assets/locales/es.json' with { type: "json" };

const resources: Record<string, TranlationMap> = { en ,fr, es };

export function init() {
const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang && resources[savedLang]) {
    currentLang = savedLang;
  } else {
    currentLang = 'en';
  }
  translation = resources[currentLang];
}

export function t(key: string): string {
	return (translation[key] || key);
}

export function changeLanguage(lang: string) {
	if (resources[lang]) {
		currentLang = lang;
		translation = resources[lang];
		localStorage.setItem('selectedLanguage', lang);
	}
}