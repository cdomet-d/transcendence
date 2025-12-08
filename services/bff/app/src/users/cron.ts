import cron from 'node-cron';
import type { FastifyInstance } from 'fastify';
import { AnonymizeUser, AnonymizeAccount, deleteAllFriendship } from './bffUserProfile.service.js';

const TWO_YEARS_MS = 2 * 365 * 24 * 60 * 60 * 1000;

export function startRetentionPolicyJob(serv: FastifyInstance) {
	cron.schedule('0 3 * * *', async () => {
		serv.log.error('[CRON] Starting daily retention policy check...');
		try {
			const response = await fetch('http://users:2626/inactive', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			});

			if (!response.ok) {
				serv.log.error('[CRON] Failed to fetch inactive users list');
				return;
			}

			const inactiveUsers = await response.json() as { userIDs: string[] };

			if (!inactiveUsers.userIDs || inactiveUsers.userIDs.length === 0) {
				serv.log.info('[CRON] No inactive accounts found.');
				return;
			}

			serv.log.info(`[CRON] Found ${inactiveUsers.userIDs.length} accounts to anonymize.`);

			const systemToken = generateSystemToken(serv);

			for (const userID of inactiveUsers.userIDs) {
				try {
					serv.log.info(`[CRON] Processing deletion for user: ${userID}`);

					await AnonymizeUser(serv.log, userID, systemToken);

					try {
						await deleteAllFriendship(serv.log, userID, systemToken);
					} catch (e) {
						serv.log.warn(`[CRON] Friend deletion warning for ${userID}`);
					}

					await AnonymizeAccount(serv.log, userID, systemToken);

					serv.log.info(`[CRON] Successfully anonymized user: ${userID}`);

				} catch (err) {
					serv.log.error(`[CRON] Failed to anonymize user ${userID}: ${err}`);
				}
			}

		} catch (error) {
			serv.log.error(`[CRON] Critical error in retention job: ${error}`);
		}
	});
}

function generateSystemToken(serv: FastifyInstance): string {
	return serv.jwt.sign({
		userID: 'system-cron-job',
		username: 'system',
		role: 'admin'
	});
}
