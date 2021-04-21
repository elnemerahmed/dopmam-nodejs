
const { buildCCP, buildWallet } = require('./ccp.js');
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require( 'fabric-ca-client' );
const { enrollAdmin, registerAndEnrollUser } = require( './ca.js' );
const { firstChannel, chaincodeName } = require('./utils.js');
const { buildCAClient } = require( './ca.js' );

const organization = 'shifa';
const affiliation = 'shifa.children';
const user = 'waleed.mortaja';
const channel = firstChannel( organization );
const chaincode = chaincodeName();

async function main () { 
    const ccp = buildCCP( organization );
    const caClient = buildCAClient( FabricCAServices, ccp, organization );
    const wallet = await buildWallet(Wallets, true);
    await enrollAdmin(caClient, wallet, organization);
    await registerAndEnrollUser( caClient, wallet, organization, user, affiliation );
    const gateway = new Gateway();

    await gateway.connect( ccp, { wallet, identity: user, discovery: { enabled: true, asLocalhost: true }});
    const network = await gateway.getNetwork( channel );
    const contract = network.getContract(chaincode);
}

main();

/*
const express = require( 'express' );

const app = express();
const port = 3000;
app.listen( port, () => {
    console.log( `Running server at http://localhost:${ port }` );
});
*/