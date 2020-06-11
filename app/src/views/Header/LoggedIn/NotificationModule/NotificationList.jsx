import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  List,
  ListSubheader,
  Paper,
} from '../../../../components/MUI';
import NotificationFactory from '../../../../components/Custom/NotificationFactory';

import styles from './NotificationModule.module.css';

export default function NotificationList(props) {
  const { closeNotificationModule, open } = props;
  const { t } = useTranslation();

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

  return open ? (
    <Paper className={styles.paper}>
      <List
        subheader={
          <ListSubheader
            component="div"
            id="notification-list-subheader"
          >
            {t('notifications')}
          </ListSubheader>
        }
        disablePadding
      >
        {testNotifications.map((notification, index) => (
          <NotificationFactory
            key={index}
            {...notification}
            closeNotificationModule={closeNotificationModule}
          />
        ))}
      </List>
    </Paper>
  ) : (
    <></>
  );
}
