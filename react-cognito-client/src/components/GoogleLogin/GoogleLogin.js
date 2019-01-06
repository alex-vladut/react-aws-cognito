import React from 'react';

import cache from '../../utils/script_cache';

const googleLogin = (props) => {

    const onSuccess = (googleUser) => {
        props.onLoginSuccess(googleUser);

        const expiresInMillis = googleUser.Zi.expires_in * 1000;
        setTimeout(() => props.onSessionExpired(), expiresInMillis);
    };

    const onFailure = (error) => {
        props.onLoginError(error);
    }

    cache({ google: 'https://apis.google.com/js/platform.js' })
        .google.onLoad((err) => {
            if (err) {
                console.log('An error was encountered when loading Google API.', err);
            } else {
                window.gapi.signin2.render('my-signin2', {
                    'scope': 'profile email',
                    'onsuccess': onSuccess,
                    'onfailure': onFailure
                });
            }
        });

    return (<div id="my-signin2"></div>);
};

export default googleLogin;