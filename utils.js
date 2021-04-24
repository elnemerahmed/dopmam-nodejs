exports.getConnectionProfile = ( organization ) => {
    return `connection-${ organization }.json`;
};

exports.getMSP = ( organization ) => {
    return `${organization.charAt(0).toUpperCase()}${organization.slice(1)}MSP`;
};

exports.getCAHost = ( organization ) => {
    return `ca.${organization}.moh.ps`;
};

exports.getCAAdminId = () => {
    return `admin`;
};

exports.getCAAdminPassword = ( ) => {
    return `adminpw`;
};

exports.getChannelName = ( organization ) => {
    return `dopmam-${organization}`;
};

exports.getChaincodeName = ( ) => {
    return `CHAINCODE_NAME`;
};

exports.getUserLabel = (user, organization) => {
    return `${ user }@${ organization }.moh.ps`;
}