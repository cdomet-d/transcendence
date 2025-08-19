//tokenizer.ts
import type { Token } from "./types.js";

export const tokenizer = (input: string): Token[] => {
	let current = 0;
	const tokens: Token[] = [];
	while (current < input.length) {
		let char = input[current];
		if (char === "{") {
			tokens.push({type: "BraceOpen", value: char});
			current++;
			continue ;
		}
		if (char === "}") {
			tokens.push({type: "BraceClose", value: char});
			current++;
			continue ;
		}
		if (char === "[") {
			tokens.push({type: "BracketOpen", value: char});
			current++;
			continue ;
		}
		if (char === "]") {
			tokens.push({type: "BracketClose", value: char});
			current++;
			continue ;
		}
		if (char === ",") {
			tokens.push({type: "Comma", value: char});
			current++;
			continue ;
		}
		if (char === ":") {
			tokens.push({type: "Colon", value: char});
			current++;
			continue ;
		}
		if (char === '"') {
			let value = "";
			char = input[++current];
			while (char !== '"') {
				value += char;
				char = input[++current];
			}
			current++;
			tokens.push({type: "String", value});
			continue ;
		}
		if (/\s/.test(char)) {
			current++;
			continue ;
		}
		throw new Error("Unexepected char: " + char);
	}
	return tokens;
};