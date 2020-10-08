import React from 'react';

export default function AppLink(props) {
  
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
  const FB.getLoginStatus= (function(response) =>{
    statusChangeCallback(response);
});

}
