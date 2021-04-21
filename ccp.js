const config = require( './configuration' );
const { connectionProfile } = require('./utils.js');
const path = require('path');
const fs = require('fs');

exports.buildCCP = (organization) => {
    const connectionProfilePath = path.resolve(__dirname, 'connection-profiles', connectionProfile(organization));
    const ccp = JSON.parse( fs.readFileSync( connectionProfilePath, 'utf8' ) );
    console.log( `Loaded ${ organization } configuration located at ${ connectionProfilePath }` );
    return ccp;
}

exports.buildWallet = async ( Wallets, isFileSystemWallet ) => {
    let wallet;
    if ( isFileSystemWallet ) {
        wallet = await Wallets.newFileSystemWallet( path.resolve( __dirname, 'wallet' ) );
        console.log(`Built a file system wallet`);
    } else {
        wallet = await Wallets.newInMemoryWallet();
        console.log('Built an in memory wallet');
    }
    return wallet;
};