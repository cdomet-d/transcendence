import dns from 'dns';
import fs from 'fs';

function getNginxIP(): string | null {
  const ip: string | undefined = process.env.NGINXIP;
  if (ip === undefined)
    throw new Error('NGINXIP is undefined');
  dns.lookup(ip, (err, address) => {
    if (err) 
      throw new Error('failed to resolve nginx IP address');
    return address;
  });
  return null;
}

function getBffIP(): string | null {
  const ip: string | undefined = process.env.BFFIP;
  if (ip === undefined)
    throw new Error('BFF IP is undefined');
  dns.lookup(ip, (err, address) => {
    if (err) 
      throw new Error('failed to resolve BFF IP address');
    return address;
  });
  return null;
}

function getAuthIP(): string | null {
  const ip: string | undefined = process.env.AUTHIP;
  if (ip === undefined)
    throw new Error('AUTH IP is undefined');
  dns.lookup(ip, (err, address) => {
    if (err) 
      throw new Error('failed to resolve auth IP address');
    return address;
  });
  return null;
}

function checkProxy(address: string, hop: number): boolean {
  const nginxIP = getNginxIP();
  const bffIP = getBffIP();
  const authIP = getAuthIP();
  if ((address === nginxIP  || address === bffIP || address === authIP) && hop === 3)
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