import React, { useState, useEffect } from 'react';
import styles from './Tag.module.css';

import { Icon } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';

export default function Tag(props) {
  const { type } = props;
  const [color, setColor] = useState('#fff');
  const [backgroundColor, setBackgroundColor] = useState('#cf8f8a');
  const [name, setName] = useState('tag');
  const [icon, setIcon] = useState('');

  const selectTag = () => {
    switch (type) {
      case 'accepted':
        setName('accepted');
        setBackgroundColor('#4fc947');
        setColor('#fff');
        break;

      case 'pending':
        setName('pending');
        setBackgroundColor('#ffca61');
        setColor('#fff');
        break;

      case 'registered':
        setBackgroundColor('#4fc947');
        setIcon('FiberManualRecord');
        break;

      case 'unregistered':
        setBackgroundColor('#ff723b');
        setIcon('FiberManualRecord');
        break;

      default:
        setName('DEFAULT');
        setBackgroundColor('#cf8f8a');
        setColor('#fff');
        break;
    }
  };

  useEffect(() => {
    selectTag();
  }, []);

  return icon ? (
    <Icon icon={icon} color={backgroundColor} />
  ) : (
    <div
      className={styles.tag}
      style={{ backgroundColor: backgroundColor }}
    >
      <div className={styles.name}>
        <Typography style={{ fontSize: 12, color: color }}>
          {name}
        </Typography>
      </div>
    </div>
  );
}
