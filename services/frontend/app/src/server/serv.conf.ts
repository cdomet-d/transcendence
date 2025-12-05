import dns from 'dns';

function getNginxIP(): string | null {
	const ip: string | undefined = process.env.NGINXIP;
	if (ip === undefined) throw new Error('NGINXIP is undefined');
	dns.lookup(ip, (err, address) => {
		if (err) throw new Error('failed to resolve nginx IP address');
		return address;
	});
	return null;
}

function checkProxy(address: string, hop: number): boolean {
	const nginxIP = getNginxIP();
	if (address === nginxIP && hop === 1) return true;
	return false;
}

const options = {
	logger: {
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
				translateTime: 'SYS:dd-mm-yyyy HH:MM:ss', // local date and time with timezone offset
				singleLine: true,
			},
		},
	},
	trustProxy: checkProxy,
	//connectionTimeout
	//forceCloseConnections
	//pluginTimeout
};

export { options };
