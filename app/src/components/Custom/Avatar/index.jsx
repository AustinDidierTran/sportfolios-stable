import React from 'react';

import { Avatar } from '../../MUI';
import clsx from 'clsx';

import styles from './Avatar.module.css';

export default function CustomAvatar(props) {
  const { initials, photoUrl, ...otherProps } = props;

  console.log('props.size', props.size);

  let className = clsx(styles.avatar, props.className);
  if (props.size === 'md') {
    className = clsx(styles.avatar, styles.md, props.className);
  } else if (props.size === 'lg') {
    className = clsx(styles.lg, styles.avatar, props.className);
  }

  if (props.size === 'md') {
    style.fontSize = '24px';
    style.width = '64px';
    style.height = '64px';
    style.marginRight = 'auto';
    style.marginLeft = 'auto';
  }

  return photoUrl ? (
    <Avatar
      {...otherProps}
      className={className}
      src={photoUrl}
      alt={initials}
    >
      {initials}
    </Avatar>
  ) : (
    <Avatar {...otherProps} className={className}>
      {initials}
    </Avatar>
  );
}
