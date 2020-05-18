import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Avatar } from '../../../Custom';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { goTo, ROUTES } from '../../../../actions/goTo';

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import styles from './NotificationFactory.module.css';
import api from '../../../../actions/api';

export default function FollowNotification(props) {
  const { t } = useTranslation();

  const {
    closeNotificationModule,
    created_at,
    first_name,
    follower,
    last_name,
    photo_url,
    seen_at,
  } = props;

  const fullName = useMemo(() => `${first_name} ${last_name}`, [
    first_name,
    last_name,
  ]);

  const text = useMemo(
    () => t('follow_notification_text', { follower: fullName }),
    [fullName],
  );

  const initials = useMemo(
    () =>
      fullName
        .split(/(?:-| )+/)
        .reduce(
          (prev, curr, index) =>
            index <= 2 ? `${prev}${curr[0]}` : prev,
          '',
        ),
    [fullName],
  );

  const onClick = async () => {
    if (!seen_at) {
      await api('/api/notifications/follow/see', {
        method: 'POST',
        body: JSON.stringify({
          follower,
        }),
      });
    }
    closeNotificationModule();
    goTo(ROUTES.profile, { id: follower });
  };

  return (
    <ListItem button onClick={onClick} key={fullName}>
      <ListItemIcon className={styles.icon}>
        <Avatar
          className={styles.avatar}
          initials={initials}
          photoUrl={photo_url}
        />
      </ListItemIcon>
      <ListItemText primary={text} />
      {seen_at ? (
        <></>
      ) : (
        <FiberManualRecordIcon style={{ color: '#54b095' }} />
      )}
    </ListItem>
  );
}
