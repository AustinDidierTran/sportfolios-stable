import React from 'react';

import { Avatar } from '../../MUI';
import clsx from 'clsx';

import styles from './Avatar.module.css';

export default function CustomAvatar(props) {
  const { initials, photoUrl, ...otherProps } = props;

  const style = {};

  if (props.size === 'lg') {
    style.fontSize = '48px';
    style.width = '128px';
    style.height = '128px';
    style.marginRight = 'auto';
    style.marginLeft = 'auto';
  }

  return photoUrl ? (
    <Avatar
      {...otherProps}
      className={clsx(styles.avatar, props.className)}
      style={style}
      src={photoUrl}
      alt={initials}
    >
      {initials}
    </Avatar>
  ) : (
    <Avatar
      {...otherProps}
      className={clsx(styles.avatar, props.className)}
      style={style}
    >
      {initials}
    </Avatar>
  );
}
