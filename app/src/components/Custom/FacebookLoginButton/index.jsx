import React from 'react';
import { useFacebookSDK } from '../../../hooks/setup';
import {FACEBOOK_STATUS_ENUM} from '../../../../../common/enums'

export default function FacebookLoginButton(props) {
  useFacebookSDK();
  const {
    onSuccessfulConnection,
    onAuthorizationNotGiven,
    onConnectionFailure,
  } = props;

  const statusChangeCallback = response => {
    if (response.status === FACEBOOK_STATUS_ENUM.CONNECTED) {
      onSuccessfulConnection();
    } else if (response.status === FACEBOOK_STATUS_ENUM.NOT_AUTHORIZED) {
      onAuthorizationNotGiven();
    } else {
      onConnectionFailure();
    }
  };

  const checkLoginState = () => {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  };

  const handleFBLogin = () => {
    FB.login(checkLoginState());
  };

  return (
    <div>
      <div
        class="fb-login-button"
        data-size="large"
        data-button-type="continue_with"
        data-layout="default"
        data-auto-logout-link="true"
        data-use-continue-as="false"
        data-width=""
        scope="public_profile,email,user_birthday"
        onlogin={handleFBLogin}
      ></div>
    </div>
  );
}
