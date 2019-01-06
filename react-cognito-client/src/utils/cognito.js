import AWS from 'aws-sdk';

import properties from './properties';

export const authenticatedWithGoogle = (googleUser) => {
    const id_token = googleUser.getAuthResponse().id_token;

    AWS.config.region = properties.region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: properties.cognitoPoolId,
        Logins: {
            'accounts.google.com': id_token
        }
    });
};

export const unauthenticated = () => {
    AWS.config.region = properties.region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: properties.cognitoPoolId
    });
};
