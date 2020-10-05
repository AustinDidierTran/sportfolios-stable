import React from 'react';
import { GLOBAL_ENUM } from '../../../../../common/enums';
import { List } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import styles from './Ranking.module.css';
import { Typography } from '@material-ui/core';

export default function Ranking(props) {
  const { t } = useTranslation();
  const { ranking } = props;
  return (
    <div className={styles.main}>
      <Typography style={{ marginBottom: '8px' }}>
        {t('ranking')}
      </Typography>
      <List
        items={ranking.map((r, index) => ({
          ...r,
          type: GLOBAL_ENUM.RANKING_WITH_STATS,
          index: index + 1,
        }))}
      />
    </div>
  );
}
