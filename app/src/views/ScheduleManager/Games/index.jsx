import React from 'react';
import { Card } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import styles from './Games.module.css';
import { Typography } from '@material-ui/core';
import { CARD_TYPE_ENUM } from '../../../../../common/enums';

export default function Games(props) {
  const { t } = useTranslation();
  const { games, changeScore } = props;

  return (
    <div className={styles.main}>
      <Typography
        variant="body2"
        color="textSecondary"
        component="p"
        style={{ marginBottom: '8px' }}
      >
        {t('games')}
      </Typography>
      {games.map(game => (
        <Card
          items={{ ...game, changeScore }}
          type={CARD_TYPE_ENUM.GAME}
        />
      ))}
    </div>
  );
}
