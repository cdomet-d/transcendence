import dns from 'dns/promises';
import fs from 'fs';

async function getNginxIP(): Promise<string | null> {
  try {
    const ip: string | undefined = process.env.NGINXIP;
    if (ip === undefined)
      throw new Error('NGINXIP is undefined');;
    const result = await dns.lookup(ip);
    return result.address;
  } catch (err) {
    return null;
  }
}

const nginxIP = await getNginxIP();

function checkProxy(address: string, hop: number): boolean {
  if (address === nginxIP && hop === 1)
    return true;
  return false;
}

const options = {
  logger: {
    file: '/usr/src/app/server.log'
  },
  trustProxy: checkProxy,
  https: {
    key: fs.readFileSync('/run/secrets/ssl-key.pem'),
    cert: fs.readFileSync('/run/secrets/ssl-cert.pem'),
  }
  //connectionTimeout
  //forceCloseConnections
  //pluginTimeout
}

export { options };