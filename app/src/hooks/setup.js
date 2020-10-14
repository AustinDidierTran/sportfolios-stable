import { useEffect, useContext } from 'react';
import { FACEBOOK_APP_ID } from '../../../conf';
import { Store } from '../../src/Store';
import { LANGUAGE_ENUM } from '../../../common/enums';
export const useFacebookSDK = () => {
  const {
    state: { userInfo },
  } = useContext(Store);
  const loadFbLoginApi = language => {
    window.fbAsyncInit = function() {
      FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true, // enable cookies to allow the server to access
        // the session
        xfbml: true, // parse social plugins on this page
        version: 'v8.0',
      });
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      if (language == LANGUAGE_ENUM.FRANCAIS) {
        js.src = '//connect.facebook.net/fr_CA/sdk.js';
      } else {
        js.src = '//connect.facebook.net/en_US/sdk.js';
      }

      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  };

  useEffect(() => loadFbLoginApi(userInfo.language), [
    userInfo.language,
  ]);
};
