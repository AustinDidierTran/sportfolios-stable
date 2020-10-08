import React from 'react';
import { Card, Button, List } from '../../../components/Custom';
import { useFacebookSDK } from '../../../hooks/setup';

export default function AppLinking() {
  useFacebookSDK();
  const testAPI = () => {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      console.log({ response });
    });
  };

  const statusChangeCallback = response => {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
      testAPI();
    } else if (response.status === 'not_authorized') {
      console.log('Please log into this app.');
    } else {
      console.log('Please log into this facebook.');
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
      <Card></Card>

      <Button
        classNames="btn-facebook"
        id="btn-social-login"
        onClick={handleFBLogin}
      >
        <span className="fa fa-facebook"></span> Sign in with Facebook
      </Button>
      <div
        class="fb-login-button"
        data-size="large"
        data-button-type="continue_with"
        data-layout="default"
        data-auto-logout-link="true"
        data-use-continue-as="false"
        data-width=""
        scope="public_profile,email,user_birthday"
        onlogin={checkLoginState}
      ></div>
    </div>
  );
}
