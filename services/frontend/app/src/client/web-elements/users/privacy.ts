import { currentDictionary } from '../forms/language';
import { createHeading } from '../typography/helpers';

export class Privacy extends HTMLDivElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.render();
	}

	render() {
		this.id = 'privacy';
		this.className = 'bg content-h w-full brdr overflow-y-auto overflow-x-hidden pad-sm';

		const h1 = createHeading('3', currentDictionary.privacy.mainTitle);
		const storageTitle = createHeading('3', currentDictionary.privacy.storageTitle);
		const rightsTitle = createHeading('3', currentDictionary.privacy.rightsTitles);

		const intro = document.createElement('p');
		intro.textContent = currentDictionary.privacy.intro;
		intro.className = 'text-wrap f-s';

		const storageList = document.createElement('ul');
		storageList.className = 'list-disc list-inside mb-l space-y-s f-s';

		const dataPoints = [
			currentDictionary.privacy.identity,
			currentDictionary.privacy.auth,
			currentDictionary.privacy.history,
			currentDictionary.privacy.social,
			currentDictionary.privacy.sessionData,
		];

		dataPoints.forEach((point) => {
			const li = document.createElement('li');
			li.innerHTML = point;
			storageList.appendChild(li);
		});

		const rightsList = document.createElement('ul');
		rightsList.className = 'list-disc list-inside mb-l space-y-s f-s';

		const rightsPoints = [currentDictionary.privacy.access, currentDictionary.privacy.erasure, currentDictionary.privacy.rectify];

		rightsPoints.forEach((point) => {
			const li = document.createElement('li');
			li.innerHTML = point;
			rightsList.appendChild(li);
		});

		this.append(h1, intro, storageTitle, storageList, rightsTitle, rightsList);
	}
}

if (!customElements.get('privacy-page')) {
	customElements.define('privacy-page', Privacy, { extends: 'div' });
}

export function createPrivacy(): Privacy {
	const el = document.createElement('div', { is: 'privacy-page' }) as Privacy;
	return el;
}
