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

export function isPasswordSafe(password: string): boolean {
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{12,64}$'/;
	return (regex.test(password))
}