export function cleanInput(input: string): string {
	if (!input) return '';
	return input.replace(/[^a-zA-Z0-9-]/g, '');
}