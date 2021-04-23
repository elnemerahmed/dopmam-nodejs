
const { getCAHost, getMSP, getCAAdminId, getCAAdminPassword, getUserLabel } = require( './utils.js' );

exports.buildCAClient = ( FabricCAServices, ccp, organization ) => {
	const caInfo = ccp.certificateAuthorities[getCAHost(organization)];
	const caTLSCACerts = caInfo.tlsCACerts.pem;
	const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
	console.log(`Built a CA Client named ${caInfo.caName}`);
	return caClient;
};

exports.enrollAdmin = async (caClient, wallet, organization) => {
    try {
        const MSP = getMSP( organization );
		const adminId = getCAAdminId( );
		const adminLabel = getUserLabel(adminId, organization );
        const password = getCAAdminPassword( );
		const identity = await wallet.get(adminLabel);
		if (identity) {
			console.log('An identity for the admin user already exists in the wallet');
			return;
		}
		const enrollment = await caClient.enroll({ enrollmentID: adminId, enrollmentSecret: password });
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: MSP,
			type: 'X.509',
		};
		await wallet.put(adminLabel, x509Identity);
		console.log('Successfully enrolled admin user and imported it into the wallet');
	} catch (error) {
		console.error(`Failed to enroll admin user : ${error}`);
	}
};

exports.registerAndEnrollUser = async (caClient, wallet, organization, userId) => {
	try {
		const userLabel = getUserLabel( userId, organization );
		const userIdentity = await wallet.get(userLabel);
		if (userIdentity) {
			console.log(`An identity for the user ${userId} already exists in the wallet`);
			return;
		}

		const adminId = getCAAdminId( );
		const adminLabel = getUserLabel( adminId, organization );
        const adminIdentity = await wallet.get( adminLabel );
		if (!adminIdentity) {
			console.log('An identity for the admin user does not exist in the wallet');
			console.log('Enroll the admin user before retrying');
			return;
		}

		const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext( adminIdentity, adminId );
        
		const secret = await caClient.register({
			enrollmentID: userId,
			role: 'client'
		}, adminUser );
		
		const enrollment = await caClient.enroll({
			enrollmentID: userId,
			enrollmentSecret: secret
		} );
		
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: getMSP(organization),
			type: 'X.509',
		};
		await wallet.put(userLabel, x509Identity);
		console.log(`Successfully registered and enrolled user ${userLabel} and imported it into the wallet`);
	} catch (error) {
		console.error(`Failed to register user : ${error}`);
	}
};

exports.list = async (wallet) => {
	let identities = [];
	let list = await wallet.list();
	for ( var i = 0; i < list.length; i++ ) {
		identities.push(list[i].label);
	}
	return identities;
};