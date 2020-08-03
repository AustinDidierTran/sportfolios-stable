import React, { useState, useEffect } from 'react';
import styles from './Tag.module.css';

import { Icon } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';
import { TAG_TYPE_ENUM } from '../../../../../common/enums';

export default function Tag(props) {
  const { type } = props;
  const [color, setColor] = useState('#fff');
  const [backgroundColor, setBackgroundColor] = useState('#cf8f8a');
  const [name, setName] = useState('tag');
  const [icon, setIcon] = useState('');

  const selectTag = () => {
    switch (type) {
      case TAG_TYPE_ENUM.ACCEPTED:
        setName('accepted');
        setBackgroundColor('#4fc947');
        setColor('#fff');
        break;

      case TAG_TYPE_ENUM.PENDING:
        setName('pending');
        setBackgroundColor('#ffca61');
        setColor('#fff');
        break;

      case TAG_TYPE_ENUM.REGISTERED:
        setBackgroundColor('#4fc947');
        setIcon('FiberManualRecord');
        break;

      case TAG_TYPE_ENUM.UNREGISTERED:
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

  if (icon) {
    return <Icon icon={icon} color={backgroundColor} />;
  }

  return (
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
