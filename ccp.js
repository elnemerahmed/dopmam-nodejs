const { getConnectionProfile } = require('./utils.js');
const path = require('path');
const fs = require('fs');

exports.buildCCP = (organization) => {
    const connectionProfilePath = path.resolve(__dirname, 'connection-profiles', getConnectionProfile(organization));
    const ccp = JSON.parse( fs.readFileSync( connectionProfilePath, 'utf8' ) );
    console.log( `Loaded ${ organization } configuration located at ${ connectionProfilePath }` );
    return ccp;
}

exports.buildWallet = async ( Wallets, organization ) => {
    return await Wallets.newFileSystemWallet( path.resolve( __dirname, 'wallets', `${organization}.moh.ps` ) );
};