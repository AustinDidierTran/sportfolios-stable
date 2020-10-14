import { Card, Typography } from '@material-ui/core';
import React, {useState, useEffect, useContext} from 'react';
import {Button } from '../../../components/Custom';
import { useFacebookSDK } from '../../../hooks/setup';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import {
  STATUS_ENUM,
  SEVERITY_ENUM,
} from '../../../../../common/enums';
import {ERROR_ENUM, errors} from '../../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../Store';
import styles from './AppLinking.module.css'

export default function AppLinking() {
  useFacebookSDK();
  const [isLinkedFB, setIsLinkedFB] = useState(false);
  const [error, setError] = useState(false);
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const fetchConnectedApp = async () => {
    const res = await api('/api/user/connectedApps');
    if(res.status=== STATUS_ENUM.ERROR){
      return;
    }
    const {data}=res;
    if(!data){
      return;
    }

    setIsLinkedFB(data.facebook.connected);
    
  }
  useEffect(()=>{fetchConnectedApp()}, []);
  const onSuccessfulFBConnection =  () => {
    setError(false);
    FB.api('/me?fields=id,email,picture,first_name,last_name', async (response)=>{
      const {id:facebook_id, first_name:name, last_name:surname, email, picture}=response;
      const res = await api('/api/user/facebookConnection', {
        method: 'POST',
        body: JSON.stringify({
          facebook_id,
          name,
          surname,
          email,
          picture:picture.data.url,
        }),
      });
      if (res.status === errors[ERROR_ENUM.ACCESS_DENIED].code) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message:t('account_already_linked'),
          severity: SEVERITY_ENUM.ERROR,
          duration:4000,
        });
      } else if (res.status != STATUS_ENUM.SUCCESS) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message:t('something_went_wrong'),
          severity: SEVERITY_ENUM.ERROR,
          duration:4000,
        });
        onFBUnlink();
      }else{
        setIsLinkedFB(true);
      }
    });
   
  }
  const onFBConnectionFailure = () => {
    setError(true);
  }
  const statusChangeCallback = response => {
    if (response.status === 'connected') {
      onSuccessfulFBConnection();
    } else if (response.status === 'not_authorized') {
      //User did not provide email, but it is not a problem as they are already registered
      onSuccessfulFBConnection();
    } else {
      onFBConnectionFailure();
    }
  };
  const checkLoginState = () => {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  };

  const onFBUnlink = async () => {
    const res = await api('/api/user/facebookConnection',
      { method: 'DELETE' },
    );
    if (res.status===STATUS_ENUM.ERROR){
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message:t('something_went_wrong'),
        severity: SEVERITY_ENUM.ERROR,
        duration:4000,
      });
    }else{
      setIsLinkedFB(false);
    }
  }

  const handleFBLogin = () => {
    if(!isLinkedFB){
    FB.login(checkLoginState(), {scope: 'public_profile, email'});
    }else{
      onFBUnlink();
    }
  };

  return (
    <div>
      <Card className={styles.card}>
        <Typography color='textSecondary'>
          {t('my_apps')}
        </Typography>
        {error ? (<Typography color='error'  >
          {t('connection_failed')}
        </Typography>):(<></>)}
        <Button size='medium' onClick={handleFBLogin} endIcon='Facebook'>
          {isLinkedFB?  t('unlink_facebook_account'):t('connect_with_facebook')}
        </Button>
      </Card>
    </div>
  );
}
