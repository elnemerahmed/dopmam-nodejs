
const { buildCCP, buildWallet } = require('./ccp.js');
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require( 'fabric-ca-client' );
const { enrollAdmin, registerAndEnrollUser } = require( './ca.js' );
const { getChannelName, getUserLabel } = require('./utils.js');
const { buildCAClient } = require( './ca.js' );

// Variables
const organization = 'shifa';
const user = 'waleed.mortaja';
const channel = getChannelName( organization );

async function main () { 
    const ccp = buildCCP( organization );
    const caClient = buildCAClient( FabricCAServices, ccp, organization );
    const wallet = await buildWallet(Wallets, organization);
    await enrollAdmin(caClient, wallet, organization);
    await registerAndEnrollUser( caClient, wallet, organization, user );
    const gateway = new Gateway();

    let connectionOptions = {
        identity: getUserLabel(user, organization),
        wallet: wallet,
        gatewayDiscovery: {
            enabled: true,
            asLocalhost: true
        }
    };
    await gateway.connect( ccp, connectionOptions );
    
    const network = await gateway.getNetwork( channel );
    const contract = network.getContract(chaincode);
}

main();
































//const affiliation = 'shifa.children';



/*
const express = require( 'express' );

const app = express();
const port = 3000;
app.listen( port, () => {
    console.log( `Running server at http://localhost:${ port }` );
});
*/