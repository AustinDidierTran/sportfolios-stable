import React, { useEffect, useContext, useMemo } from 'react';

import { formatPageTitle } from '../../utils/stringFormats';
import { IgContainer, LoadingSpinner } from '../../components/Custom';
import { Store } from '../../Store';
import { useTranslation } from 'react-i18next';
import AppLinking from './AppLinking';
import BasicInfo from './BasicInfo';
import BottomPageLogo from '../../components/Custom/BottomPageLogo';
import ChangePassword from './ChangePassword';
import CreditCards from './CreditCards';
import Disconnect from './Disconnect';
import Email from './Email';
import MyPersons from './MyPersons';
import Notifications from './Notifications';
import Coupons from './Coupons';

export default function UserSettings() {
  const { t } = useTranslation();
  const { state } = useContext(Store);
  useEffect(() => {
    document.title = formatPageTitle(t('settings'));
  }, []);

  const isLoggedIn = useMemo(() => Boolean(state.userInfo), [
    state.userInfo,
  ]);

  //Scroll to given section specified with # in the url
  const scroll = () => {
    const hash = window.location.hash.substr(1);
    if (hash) {
      const anchor = document.getElementById(hash);
      setTimeout(() => {
        anchor?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 500);
    }
  };
  useEffect(scroll, []);

  if (!isLoggedIn) {
    return <LoadingSpinner />;
  }

  return (
    <IgContainer>
      <Coupons />
      <BasicInfo />
      <Email />
      <MyPersons />
      <ChangePassword />
      <AppLinking />
      <CreditCards />
      <div id="notifications">
        <Notifications />
      </div>
      <Disconnect />
      <BottomPageLogo />
    </IgContainer>
  );
}
