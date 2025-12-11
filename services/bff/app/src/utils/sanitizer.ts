import sanitizeHtml from 'sanitize-html';

const strictOptions: sanitizeHtml.IOptions = {
	allowedTags: [],
	allowedAttributes: {},
	disallowedTagsMode: 'discard'
};

export function cleanInput(input: string): string {
	if (!input) return '';
	return sanitizeHtml(input, strictOptions);
}

//TODO REGEX For username '^[A-Za-z0-9]{4,18}$' and return 400
export function cleanUsername(username: string): boolean {
	const regex = /^[A-Za-z0-9]{4,18}$/;
	return regex.test(username);
}

export function cleanBioInput(input: string): string {
	if (!input) return '';
	return sanitizeHtml(input, {
		allowedTags: ['b', 'i', 'em', 'strong', 'br'],
		allowedAttributes: {}
	});
}

export function isUsernameSafe(username: string): boolean {
	const regex = /^[a-zA-Z0-9_]+$/;
	return regex.test(username);
}