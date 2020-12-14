import React from 'react';

import { Avatar } from '../../MUI';
import { Icon } from '../../Custom';
import clsx from 'clsx';

import styles from './Avatar.module.css';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  avatarNoBackgroundColor: {
    backgroundColor: 'transparent !important',
  },
});

export default function CustomAvatar(props) {
  const { initials, photoUrl, icon, ...otherProps } = props;
  const classes = useStyles();

  let className = clsx(styles.avatar, props.className);
  if (props.size === 'sm') {
    className = clsx(styles.avatar, styles.sm, props.className);
  } else if (props.size === 'md') {
    className = clsx(styles.avatar, styles.md, props.className);
  } else if (props.size === 'lg') {
    className = clsx(styles.lg, styles.avatar, props.className);
  }

  if (photoUrl) {
    return (
      <Avatar
        {...otherProps}
        className={[className, classes.avatarNoBackgroundColor].join(
          ' ',
        )}
        src={photoUrl}
        alt={initials}
      >
        {initials}
      </Avatar>
    );
  }

  if (icon) {
    return (
      <Avatar {...otherProps} className={className} alt={initials}>
        <Icon icon={icon}></Icon>
      </Avatar>
    );
  }

  return (
    <Avatar {...otherProps} className={className}>
      {initials}
    </Avatar>
  );
}
