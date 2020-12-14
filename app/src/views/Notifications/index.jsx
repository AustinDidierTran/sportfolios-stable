import React, { useEffect } from 'react';
import api from '../../actions/api';
import { IgContainer } from '../../components/Custom';

import Notifications from '../Header/HeaderFlyout/Notifications';

import styles from './Notifications.module.css';

export default function NotificationsMobile() {
  useEffect(() => {
    api('/api/notifications/see', {
      method: 'PUT',
    });
  }, []);

  return (
    <IgContainer className={styles.mobileContainer}>
      <Notifications isMobileView />
    </IgContainer>
  );
}
