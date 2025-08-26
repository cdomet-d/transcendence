import dns from 'dns';
import fs from 'fs';
function getNginxIP() {
    const ip = process.env.NGINXIP;
    if (ip === undefined)
        throw new Error('NGINXIP is undefined');
    dns.lookup(ip, (err, address) => {
        if (err)
            throw new Error('failed to resolve nginx IP address');
        return address;
    });
    return null;
}
function checkProxy(address, hop) {
    const nginxIP = getNginxIP();
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
