import React, { useMemo } from 'react';
import styles from './Tag.module.css';

import { Icon } from '../../../components/Custom';
import { Typography } from '../../../components/MUI';
import { TAG_TYPE_ENUM } from '../../../../../common/enums';
import { useTranslation } from 'react-i18next';

export default function Tag(props) {
  const { t } = useTranslation();
  const { type } = props;

  const selectTag = useMemo(() => {
    switch (type) {
      case TAG_TYPE_ENUM.ACCEPTED:
      case TAG_TYPE_ENUM.ACCEPTED_FREE:
        return {
          name: t('accepted'),
          backgroundColor: '#4fc947',
          color: '#fff',
        };

      case TAG_TYPE_ENUM.PENDING:
        return {
          name: t('pending'),
          backgroundColor: '#ffca61',
          color: '#fff',
        };

      case TAG_TYPE_ENUM.REGISTERED:
        return {
          backgroundColor: '#4fc947',
          icon: 'FiberManualRecord',
        };

      case TAG_TYPE_ENUM.UNREGISTERED:
        return {
          backgroundColor: '#ff723b',
          icon: 'FiberManualRecord',
        };

      default:
        return {
          name: t('DEFAULT'),
          backgroundColor: '#cf8f8a',
          color: '#fff',
        };
    }
  }, [type]);

  if (selectTag.icon) {
    return (
      <Icon icon={selectTag.icon} color={selectTag.backgroundColor} />
    );
  }

  return (
    <div
      className={styles.tag}
      style={{ backgroundColor: selectTag.backgroundColor }}
    >
      <div className={styles.name}>
        <Typography style={{ fontSize: 12, color: selectTag.color }}>
          {selectTag.name}
        </Typography>
      </div>
    </div>
  );
}
