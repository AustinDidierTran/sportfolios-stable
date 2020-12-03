import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { Avatar } from '../..';
import React from 'react';
import styles from './NotificationItem.module.css';
import api from '../../../../actions/api';
import { timestampToRelativeTime } from '../../../../utils/stringFormats';

export default function NotificationItem(props) {
  const {
    clicked,
    description,
    photoUrl,
    onClick,
    initials,
    id,
    created_at,
    buttons,
  } = props;

  function handleClick() {
    if (!clicked) {
      api('/api/notifications/click', {
        method: 'PUT',
        body: JSON.stringify({
          notificationId: id,
        }),
      });
    }
    onClick();
  }

  return (
    <ListItem
      classes={{ container: clicked ? styles.old : styles.new }}
      ContainerProps={{ onClick: handleClick }}
    >
      <ListItemAvatar>
        <Avatar photoUrl={photoUrl} initials={initials} />
      </ListItemAvatar>
      <ListItemText
        className={styles.text}
        style={{ whiteSpace: 'pre-line' }}
        primary={description}
        secondary={timestampToRelativeTime(new Date(created_at))}
      />
      <ListItemSecondaryAction
        style={{
          justifyContent: 'flex-end',
          display: 'flex',
          position: 'relative',
          transform: 'translateY(-25%)',
          right: '0',
        }}
      >
        {buttons}
      </ListItemSecondaryAction>
    </ListItem>
  );
}
