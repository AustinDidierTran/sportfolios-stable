import { Card } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import { List, AlertDialog } from '../../../components/Custom';
import { useFacebookSDK } from '../../../hooks/setup';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import {
  STATUS_ENUM,
  SEVERITY_ENUM,
  APP_ENUM,
  FACEBOOK_STATUS_ENUM,
  LIST_ITEM_ENUM,
} from '../../../../../common/enums';
import { ERROR_ENUM, errors } from '../../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../Store';
import styles from './AppLinking.module.css';
import conf from '../../../../../conf';

export default function AppLinking() {
  useFacebookSDK();
  const [isLinkedFB, setIsLinkedFB] = useState(false);
  const [isLinkedMessenger, setIsLinkedMessenger] = useState(false);
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const [alertDialog, setAlertDialog] = useState(false);
  const [selectedApp, setSelectedApp] = useState('');
  const [fbUserId, setFBUserId] = useState();
  const {
    state: { userInfo },
  } = useContext(Store);

  const fetchConnectedApp = async () => {
    const res = await api('/api/user/connectedApps');
    if (res.status === STATUS_ENUM.ERROR) {
      return;
    }
    const { data } = res;

    if (data) {
      if (data.facebook) {
        setFBUserId(data.facebook.id);
        setIsLinkedFB(data.facebook.connected);
      }
      if (data.messenger) {
        setIsLinkedMessenger(data.messenger.connected);
      }
    }
  };

  useEffect(() => {
    fetchConnectedApp();
  }, []);

  const onSuccessfulFBConnection = () => {
    FB.api(
      '/me',
      'GET',
      { fields: 'id,email,picture,first_name,last_name' },
      async function(response) {
        const {
          id: facebook_id,
          first_name: name,
          last_name: surname,
          email,
          picture,
        } = response;
        const res = await api('/api/user/facebookConnection', {
          method: 'POST',
          body: JSON.stringify({
            facebook_id,
            name,
            surname,
            email,
            picture: picture ? picture.data.url : null,
          }),
        });
        if (res.status === errors[ERROR_ENUM.ACCESS_DENIED].code) {
          showErrorToast(t('account_already_linked'));
        } else if (res.status === STATUS_ENUM.SUCCESS) {
          setIsLinkedFB(true);
          setFBUserId(facebook_id);
        } else {
          showErrorToast();
          onFBUnlink();
        }
      },
    );
  };

  const showErrorToast = (message, duration) => {
    dispatch({
      type: ACTION_ENUM.SNACK_BAR,
      message: message || t('something_went_wrong'),
      severity: SEVERITY_ENUM.ERROR,
      duration: duration || 4000,
    });
  };

  const onFBConnectionFailure = () => {
    showErrorToast();
  };
  const loginCallback = response => {
    if (response.status === FACEBOOK_STATUS_ENUM.CONNECTED) {
      onSuccessfulFBConnection();
    } else if (
      response.status === FACEBOOK_STATUS_ENUM.NOT_AUTHORIZED
    ) {
      onFBConnectionFailure();
    } else {
      onFBConnectionFailure();
    }
  };

  const onFBUnlink = () => {
    setSelectedApp(APP_ENUM.FACEBOOK);
    setAlertDialog(true);
  };

  const onFBUnlinkConfirmed = async () => {
    const res = await api('/api/user/facebookConnection', {
      method: 'DELETE',
    });
    if (fbUserId == conf.FACEBOOK_ADMIN_ID) {
      setIsLinkedFB(false);
    } else if (res.status === STATUS_ENUM.SUCCESS) {
      await FB.api('/me/permissions', 'DELETE', {}, function(
        response,
      ) {
        if (
          response.success ||
          response.error.subcode ==
            466 /*Permissions already revoked*/
        ) {
          FB.logout();
          setIsLinkedFB(false);
        } else {
          showErrorToast();
        }
      });
    } else {
      showErrorToast();
    }
    setAlertDialog(false);
  };

  const openMessenger = () => {
    const win = window.open(
      `https://www.m.me/${conf.FACEBOOK_PAGE_ID}?ref=${userInfo.user_id}`,
      '_blank',
    );
    if (win != null) {
      win.focus();
    }
  };

  const onMessengerConnect = async () => {
    //if is already linked on facebook, try to link automaticaly by getting his messenger ID
    if (fbUserId) {
      const res = await api('/api/user/messengerConnection', {
        method: 'POST',
        body: JSON.stringify({
          facebook_id: fbUserId,
        }),
      });
      if (res.status == errors[ERROR_ENUM.VALUE_IS_INVALID].code) {
        openMessenger();
      } else if (res.status == STATUS_ENUM.SUCCESS) {
        setIsLinkedMessenger(true);
      } else {
        showErrorToast();
      }
    } else {
      openMessenger();
    }
  };

  const onMessengerUnlink = async () => {
    setSelectedApp(APP_ENUM.MESSENGER);
    setAlertDialog(true);
  };

  const onMessengerUnlinkConfirmed = async () => {
    const res = await api('/api/user/messengerConnection', {
      method: 'DELETE',
    });
    if (res.status === STATUS_ENUM.SUCCESS) {
      setIsLinkedMessenger(false);
    } else {
      showErrorToast();
    }
    setAlertDialog(false);
  };

  const items = [
    {
      onConnect: () => {
        FB.login(response => loginCallback(response), {
          scope: 'public_profile, email',
        });
      },
      onDisconnect: onFBUnlink,
      app: APP_ENUM.FACEBOOK,
      isConnected: isLinkedFB,
      type: LIST_ITEM_ENUM.APP_ITEM,
      description: t('facebook_description'),
      key: APP_ENUM.FACEBOOK,
    },
    {
      onConnect: onMessengerConnect,
      onDisconnect: onMessengerUnlink,
      app: APP_ENUM.MESSENGER,
      isConnected: isLinkedMessenger,
      type: LIST_ITEM_ENUM.APP_ITEM,
      description: t('messenger_description'),
      key: APP_ENUM.MESSENGER,
    },
  ];

  const unlinkConfirmedFunctions = {
    [APP_ENUM.FACEBOOK]: onFBUnlinkConfirmed,
    [APP_ENUM.MESSENGER]: onMessengerUnlinkConfirmed,
  };

  return (
    <>
      <Card className={styles.main}>
        <List title={t('my_apps')} items={items}></List>
      </Card>
      <AlertDialog
        open={alertDialog}
        description={t('disconnect_app', { appName: selectedApp })}
        onSubmit={unlinkConfirmedFunctions[selectedApp]}
        onCancel={() => setAlertDialog(false)}
      />
    </>
  );
}
