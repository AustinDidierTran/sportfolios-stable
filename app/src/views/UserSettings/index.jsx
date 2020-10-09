import React, { useEffect, useContext, useMemo } from 'react';

import styles from './UserSettings.module.css';

import BasicInfo from './BasicInfo';
import ChangePassword from './ChangePassword';
import Disconnect from './Disconnect';
import Email from './Email';
import { IgContainer, LoadingSpinner } from '../../components/Custom';
import { formatPageTitle } from '../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import MyPersons from './MyPersons';
import { Store } from '../../Store';

export default function UserSettings() {
  const { t } = useTranslation();
  const { state } = useContext(Store);
  useEffect(() => {
    document.title = formatPageTitle(t('settings'));
  }, []);

  const isLoggedIn = useMemo(() => Boolean(state.userInfo), [
    state.userInfo,
  ]);

  if (!isLoggedIn) {
    return <LoadingSpinner />;
  }
  return (
    <div className={styles.main}>
      <IgContainer className={styles.container}>
        <BasicInfo />
        <ChangePassword />
        <Email />
        <MyPersons />
        <Disconnect />
      </IgContainer>
    </div>
  );
}
