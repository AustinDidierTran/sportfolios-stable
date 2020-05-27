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

  const testNotifications = [
    {
      follower: '31df10b0-1055-4e12-ad4a-5e732b8b8544',
      seen_at: null,
      created_at: '2020-04-22T22:05:52.631Z',
      photoUrl:
        'https://media-exp1.licdn.com/dms/image/C5603AQEGh4E9nsa79g/profile-displayphoto-shrink_200_200/0?e=1594857600&v=beta&t=5kAa6ReluqmUTbry-xa_0QtBmJZlRcTiyi4t03gdRm0',
      first_name: 'Guillaume',
      last_name: 'Proulx Goulet',
      type: 'follow',
    },
    {
      follower: '31df10b0-1055-4e12-ad4a-5e732b8b8544',
      seen_at: null,
      created_at: '2020-04-22T22:05:52.631Z',
      photoUrl: null,
      first_name: 'Dave',
      last_name: 'Brideau',
      type: 'follow',
    },
  ];

  return testNotifications.length > 0 ? (
    <div className={styles.n2}>
      <Paper elevation={0} className={styles.card}>
        {testNotifications.map((notif, index) => (
          <NotificationFactory {...notif} key={index} />
        ))}
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
