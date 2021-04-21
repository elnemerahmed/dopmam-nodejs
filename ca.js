
const { mspId, caHostName, caAdminId, caAdminPassword } = require( './utils.js' );

exports.buildCAClient = ( FabricCAServices, ccp, organization ) => {
    const hostName = caHostName( organization );
	const caInfo = ccp.certificateAuthorities[hostName];
	const caTLSCACerts = caInfo.tlsCACerts.pem;
	const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
	console.log(`Built a CA Client named ${caInfo.caName}`);
	return caClient;
};

exports.enrollAdmin = async (caClient, wallet, organization) => {
    try {
        const msp = mspId( organization );
        const adminId = caAdminId( organization );
        const password = caAdminPassword( organization );
		const identity = await wallet.get(adminId);
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
			mspId: msp,
			type: 'X.509',
		};
		await wallet.put(adminId, x509Identity);
		console.log('Successfully enrolled admin user and imported it into the wallet');
	} catch (error) {
		console.error(`Failed to enroll admin user : ${error}`);
	}
};

exports.registerAndEnrollUser = async (caClient, wallet, organization, userId, affiliation) => {
	try {
		const userIdentity = await wallet.get(userId);
		if (userIdentity) {
			console.log(`An identity for the user ${userId} already exists in the wallet`);
			return;
		}

        const adminId = caAdminId( organization );
        const adminIdentity = await wallet.get( adminId );
		if (!adminIdentity) {
			console.log('An identity for the admin user does not exist in the wallet');
			console.log('Enroll the admin user before retrying');
			return;
		}

		const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext( adminIdentity, adminId );
        
		const secret = await caClient.register({
			//affiliation: affiliation,
			enrollmentID: userId,
			role: 'client'
		}, adminUser);
		const enrollment = await caClient.enroll({
			enrollmentID: userId,
			enrollmentSecret: secret
		});
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: mspId(organization),
			type: 'X.509',
		};
		await wallet.put(userId, x509Identity);
		console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
	} catch (error) {
		console.error(`Failed to register user : ${error}`);
	}
};