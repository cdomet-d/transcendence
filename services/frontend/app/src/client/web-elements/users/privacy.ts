import { createHeading } from "../typography/helpers";

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

		const h1 = createHeading('3', 'GDPR Compliance & Data Privacy');
		const storageTitle = createHeading('3', 'What We Store');
		const rightsTitle = createHeading('3', 'Your Rights');

		const intro = document.createElement('p');
		intro.textContent = 'We value your privacy. In compliance with the General Data Protection Regulation (GDPR), ' +
			'this page outlines exactly what data we store, why we store it, and your rights regarding that data.';
		intro.className = 'text-wrap f-s';


		const storageList = document.createElement('ul');
		storageList.className = 'list-disc list-inside mb-l space-y-s f-s';

		const dataPoints = [
			'<strong>Identity:</strong> Username, avatar image, and biography to display your profile to other players.',
			'<strong>Authentication:</strong> Securely hashed passwords. We never store your actual password.',
			'<strong>Game History:</strong> Statistics (Wins, Losses, Streaks) and a log of matches played to populate leaderboards and history.',
			'<strong>Social:</strong> Your list of friends and pending friend requests.',
			'<strong>Session Data:</strong> We use a secure HTTP-only cookie (JWT) to keep you logged in. \
			We do not use third-party tracking cookies. \
			In that cookie, we store your userID (that we generate) and your username (that we set) so we can render your informations on the website.\
			That cookie expires on its own after an hour.'
		];

		dataPoints.forEach(point => {
			const li = document.createElement('li');
			li.innerHTML = point;
			storageList.appendChild(li);
		});

		rightsTitle.textContent = 'Your Rights';
		rightsTitle.className = 'f-lg f-bold mb-s f-s';

		const rightsList = document.createElement('ul');
		rightsList.className = 'list-disc list-inside mb-l space-y-s f-s';

		const rightsPoints = [
			'<strong>Right to Access (Portability):</strong> You can download a full copy of your personal data in JSON format via the User Settings page.',
			'<strong>Right to Erasure (Right to be Forgotten):</strong> You can delete your account at any time. This process is permanent and irreversibly anonymizes your data (replacing your username/avatar with generic placeholders) while preserving game statistics for fair history.',
			'<strong>Right to Rectification:</strong> You can update your profile information (username, bio, avatar, language) at any time.'
		];

		rightsPoints.forEach(point => {
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