import React, { useEffect } from 'react';

import styles from './UserSettings.module.css';

import BasicInfo from './BasicInfo';
import ChangePassword from './ChangePassword';
import Disconnect from './Disconnect';
import Email from './Email';
import { IgContainer } from '../../components/Custom';
import { formatPageTitle } from '../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import MyPersons from './MyPersons';

export default function UserSettings() {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = formatPageTitle(t('settings'));
  }, []);

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
