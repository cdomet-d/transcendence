export function cleanInput(input: string): string {
	if (!input) return '';
	return input.replace(/[^a-zA-Z0-9-]/g, '');
}

export function sanitizeBodyValues(body: { [key: string]: any }) {
	const sanitized: { [key: string]: any } = {};
	for (const key in body) {
		const val = body[key];
		if (typeof val === 'string') {
			sanitized[key] = cleanInput(val);
		} else {
			sanitized[key] = val;
		}
	}
	return sanitized;
}