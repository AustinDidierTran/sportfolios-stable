import React, { useEffect, useContext, useMemo } from 'react';

import styles from './UserSettings.module.css';

import { formatPageTitle } from '../../utils/stringFormats';
import { IgContainer, LoadingSpinner } from '../../components/Custom';
import { Store } from '../../Store';
import { useTranslation } from 'react-i18next';
import AppLinking from './AppLinking';
import BankAccounts from './BankAccounts';
import BasicInfo from './BasicInfo';
import BottomPageLogo from '../../components/Custom/BottomPageLogo';
import ChangePassword from './ChangePassword';
import CreditCards from './CreditCards';
import Disconnect from './Disconnect';
import Email from './Email';
import MyPersons from './MyPersons';

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
        <Email />
        <MyPersons />
        <ChangePassword />
        <AppLinking />
        <CreditCards />
        <BankAccounts />
        <Disconnect />
        <BottomPageLogo />
      </IgContainer>
    </div>
  );
}
