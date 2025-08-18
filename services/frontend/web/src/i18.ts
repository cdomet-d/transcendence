import i18next from 'i18next';

import en from './assets/locales/en.json';
import fr from './assets/locales/fr.json';

i18next.init ({
	lng: 'en',
	resources: {
		en: { translation: en },
		fr: { translation: fr },
	}
}).then(() => {
	document.getElementById('output')!.innerHTML = i18next.t('play');
});

export default i18next;