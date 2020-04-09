import React from 'react';

import { Avatar } from '../../MUI';
import clsx from 'clsx';

import styles from './Avatar.module.css';

export default function CustomAvatar(props) {
  const { children, ...otherProps } = props;

  console.log('children', children);

  return (
    <Avatar
      {...otherProps}
      className={clsx(styles.avatar, props.className)}
    >
      {props.children}
    </Avatar>
  );
}
