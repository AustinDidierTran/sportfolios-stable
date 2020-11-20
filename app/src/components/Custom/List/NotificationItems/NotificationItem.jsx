import {
  ListItem,
  ListItemText,
  ListItemAvatar,
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
    <>
      <ListItem
        className={clicked ? styles.old : styles.new}
        onClick={handleClick}
        button
      >
        <ListItemAvatar>
          <Avatar photoUrl={photoUrl} initials={initials} />
        </ListItemAvatar>
        <ListItemText
          className={styles.text}
          primary={description}
          secondary={timestampToRelativeTime(new Date(created_at))}
        />
      </ListItem>
    </>
  );
}
