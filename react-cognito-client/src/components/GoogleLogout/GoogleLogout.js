import React from 'react';

import cache from '../../utils/script_cache';

const googleLogout = (props) => {

    const logout = () => {
        cache({ google: 'https://apis.google.com/js/platform.js' })
            .google.onLoad(async err => {
                if (err) {
                    console.log('An error was encountered when loading Google API.', err);
                } else {
                    try {
                        await window.gapi.auth2.getAuthInstance().signOut();
                        props.logoutSuccessful();
                    } catch (error) {
                        console.error('There was an error when attempting to log out.', error);
                        props.logoutFailed(error);
                    }
                }
            });
    }

    return (
        <div>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default googleLogout;