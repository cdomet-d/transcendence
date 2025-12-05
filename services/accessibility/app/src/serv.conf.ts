import dns from 'dns';
// import pino from 'pi	no'

function getBffIP(): string | null {
  const ip: string | undefined = process.env['BFFIP'];
  if (ip === undefined)
    throw new Error('NGINXIP is undefined');
  dns.lookup(ip, (err, address) => {
    if (err) 
      throw new Error('failed to resolve nginx IP address');
    return address;
  });
  return null;
}

function checkProxy(address: string, hop: number): boolean {
  const bffIP = getBffIP();
  if (address === bffIP && hop === 2)
    return true;
  return false;
}

const options = {
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss' // local date and time with timezone offset
      }
	}
  },
  trustProxy: checkProxy,
  //connectionTimeout
  //forceCloseConnections
  //pluginTimeout
}

export { options };