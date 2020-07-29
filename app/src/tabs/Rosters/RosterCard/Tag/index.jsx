import React from 'react';
import styles from './Tag.module.css';
import { Icon } from '../../../../components/Custom';
import { Typography } from '../../../../components/MUI';

export default function Tag(props) {
  const { name, icon, color } = props;

  if (icon) {
    return (
      <div
        className={styles.tag}
        style={{ backgroundColor: color || '#cf8f8a' }}
      >
        <div className={styles.icon}>
          <Icon icon={icon} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.tag}
      style={{ backgroundColor: color || '#cf8f8a' }}
    >
      <div className={styles.name}>
        <Typography>{name}</Typography>
      </div>
    </div>
  );
}
