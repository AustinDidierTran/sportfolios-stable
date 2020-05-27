import React, { useState, useEffect } from 'react';
import styles from './Notifications.module.css';
import api from '../../actions/api';
import NotificationFactory from '../../components/Custom/NotificationFactory/index';
import { useTranslation } from 'react-i18next';

import { Paper } from '../../components/MUI';
import { Typography } from '@material-ui/core';

export default function Notifications(props) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);

  const updateNotifications = async () => {
    const { data } = await api(`/api/notifications/all`);
    setNotifications(data);
  };

  useEffect(() => {
    updateNotifications();
  }, []);

  const test_notifications = [
    {
      first_name: 'Austin',
      last_name: 'Didier',
      follower: '8317ff33-3b04-49a1-afd3-420202cddf73',
    },
    {
      first_name: 'Emilie',
      last_name: 'Bouchard',
      follower: '8317ff33-3b04-49a1-afd3-420202cddf73',
    },
    {
      first_name: 'Alexandre',
      last_name: 'Lafleur',
      follower: '8317ff33-3b04-49a1-afd3-420202cddf73',
    },
    {
      first_name: 'Federation Quebecoise',
      last_name: 'Ultimate',
      follower: '8317ff33-3b04-49a1-afd3-420202cddf73',
    },
  ];

  return notifications.length > 0 ? (
    <div className={styles.n2}>
      <Paper elevation={0} className={styles.card}>
        {notifications.map((notif, index) => {
          return <NotificationFactory {...notif} key={index} />;
        })}
      </Paper>
    </div>
  ) : (
    <div className={styles.n1}>
      <Typography>
        <b>{t('no_notifications').toUpperCase()}</b>
      </Typography>
      <Typography>{t('no_notifications_message')}</Typography>
    </div>
  );
}
