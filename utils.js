const config = require( './configuration' );

exports.connectionProfile = ( organization ) => {
    return config[ organization ][ 'connection-profile' ];
};

exports.mspId = ( organization ) => {
    return config[ organization ][ 'msp' ];
};

exports.caHostName = ( organization ) => {
    return config[ organization ][ 'ca' ][ 'name' ];
};

exports.caAdminId = ( organization ) => {
    return config[ organization ][ 'ca' ][ 'ca-admin' ]['user'];
};

exports.caAdminPassword = ( organization ) => {
    return config[ organization ][ 'ca' ][ 'ca-admin' ]['password'];
};

exports.allChannels = ( organization ) => {
    return config[ organization ][ 'channels' ];
};

exports.firstChannel = ( organization ) => {
    return config[ organization ][ 'channels' ][ 0 ];
};

exports.chaincodeName = ( ) => {
    return config[ 'chaincode-name' ];
};