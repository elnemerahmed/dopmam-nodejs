const config = {
    "chaincode-name": "NAME_HERE",
    "dopmam": {
        "connection-profile": "connection-dopmam.json",
        "msp": "DopmamMSP",
        "ca": {
            "name": "ca.dopmam.moh.ps",
            "ca-admin": {
                "user": "admin",
                "password": "adminpw"
            }
        },
        "channels": ["dopmam-shifa", "dopmam-naser"]
    },
    "shifa": {
        "connection-profile": "connection-shifa.json",
        "msp": "ShifaMSP",
        "ca": {
            "name": "ca.shifa.moh.ps",
            "ca-admin": {
                "user": "shifaadmin",
                "password": "shifaadminpw"
            }
        },
        "channels": ["dopmam-shifa"]
    },
    "naser": {
        "connection-profile": "connection-shifa.json",
        "msp": "NaserMSP",
        "ca": {
            "name": "ca.naser.moh.ps",
            "ca-admin": {
                "user": "naseradmin",
                "password": "naseradminpw"
            }
        },
        "channels": [ "dopmam-naser" ]
    }
}

module.exports = config;