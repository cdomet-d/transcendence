import { Database } from 'sqlite';
import jwt from 'jsonwebtoken';
import type { ProfileCreationResult } from './auth.interfaces.js';
import type { FastifyInstance, FastifyReply } from 'fastify';
import * as bcrypt from 'bcrypt';

export async function createUserProfile(
	log: any,
	userID: string,
	username: string
): Promise<ProfileCreationResult> {
	const url = `http://nginx:80/api/users/${userID}`;

	//const body = JSON.stringify({ username: username });
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: username }),
		});
	} catch (error) {
		log.error(`[AUTH] User service (via NGINX) is unreachable: ${error}`);
		throw new Error(`Profile service failed with status`);
	}

	if (response.status === 409) {
		log.warn(`[AUTH] Username already taken for profile creation`);
		let message = 'Username or userID is already taken.';
		try {
			const errorBody = (await response.json()) as { message: string };
			if (errorBody.message) message = errorBody.message;
			return { errorCode: 'conflict' };
		} catch (error) {}
		return { errorCode: 'conflict' };
	}

	if (!response.ok) {
		log.warn(`[AUTH] User service failed with status ${response.status}`);
		throw new Error(`Profile service failed with status ${response.status}`);
	}

	const data = await response.json();
	return { errorCode: 'success', data: data };
}

export async function checkUsernameUnique(db: Database, username: string): Promise<boolean> {
	try {
		const query = `
			SELECT 1 FROM account WHERE username = ? LIMIT 1
		`;
		const response = await db.all(query, username);

		//true == username taken, false == username available
		return response.length > 0;
	} catch (error) {
		console.log(`[AUTH] Error fetching username availability for  ${username}: `, error);
		throw error;
	}
}

export async function deleteAccount(db: Database, log: any, userID: string): Promise<boolean> {
	try {
		const query = `DELETE FROM account WHERE userID = ?`;

		const result = await db.run(query, [userID]);
		if (!result.changes) return false;
		return true;
	} catch (error) {
		log.error(`[AUTH] Error deleting account: ${error}`);
		return false;
	}
}

export function extractAuthHeader(authorization?: string): string | undefined {
	if (!authorization) return undefined;
	const token = authorization.replace(/^Bearer\s+/i, '');
	return token;
}

export function validateBearerToken(serv: FastifyInstance, authorization?: string): boolean {
	const token = extractAuthHeader(authorization);
	serv.log.warn(token);
	if (!token) return false;
	serv.log.warn('Exists');
	try {
		jwt.verify(token, process.env.JWT_SECRET!);
		return true;
	} catch (error) {
		if (error instanceof Error) serv.log.warn(error.message);
		return false;
	}
}

export function clearCookie(reply: FastifyReply) {
	reply.clearCookie('token', {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/',
		maxAge: 60 * 60 * 1000,
	});
}

export function setCookie(reply: FastifyReply, token: string) {
	reply.setCookie('token', token, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/',
		maxAge: 60 * 60 * 1000,
	});
}

export async function verifyPasswordMatch(
	serv: FastifyInstance,
	username: string,
	password: string
): Promise<any> {
	try {
		const query = `
				SELECT userID, hashedPassword FROM account WHERE username = ?
			`;

		const account = await serv.dbAuth.get(query, [username]);
		if (!account) return 404;

		const passwordMatches = await bcrypt.compare(password, account.hashedPassword);
		if (!passwordMatches) return 401;

		return account;
	} catch (error) {
		serv.log.error(`[AUTH] An unexpected error occurred while login: ${error}`);
		throw error;
	}
}
