// TODO Remove Authorisation service from Auth.mmd

// beware of token Expiration date and Refresh Token Exp

import { createHmac } from 'crypto';

// TODO pass header and payload as parameters
export function generateJWT(): string | null {
	const header = {alg: "HS256", type: "JWT"};
	const payload = {userID: "123", role: "Player"};
	const secretKey: string | undefined = process.env.token;
	if (!secretKey) {
		console.log("Error: Could not find variable 'token' in `.env`!");
		return null;
	}

	// TODO make => base64Encode()
	// TODO parse output and replace '+' with '-', '/' with '_' and rm trailing '=' 
	const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64');
	const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
	const both = `${encodedHeader}.${encodedPayload}`;

	
	// TODO parse output and replace '+' with '-', '/' with '_' and rm trailing '=' 
	const signature = createHmac('sha256', secretKey!).update(both).digest('base64');

	return `${both}.${signature}`;
}
