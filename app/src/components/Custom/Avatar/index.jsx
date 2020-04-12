import React from 'react';

import { Avatar } from '../../MUI';
import clsx from 'clsx';

import styles from './Avatar.module.css';

export default function CustomAvatar(props) {
  const { initials, photoUrl, ...otherProps } = props;

  return photoUrl ? (
    <Avatar
      {...otherProps}
      className={clsx(styles.avatar, props.className)}
      src={photoUrl}
      alt={initials}
    >
      {initials}
    </Avatar>
  ) : (
    <Avatar
      {...otherProps}
      className={clsx(styles.avatar, props.className)}
    >
      {initials}
    </Avatar>
  );
}
