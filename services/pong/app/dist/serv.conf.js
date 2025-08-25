import dns from 'dns/promises';
import fs from 'fs';
async function getNginxIP() {
    try {
        const result = await dns.lookup(process.env.NGINXIP);
        return result.address;
    }
    catch (err) {
        return null;
    }
}
async function checkProxy(address, hop) {
    const nginxIP = await getNginxIP();
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
};
export { options };
