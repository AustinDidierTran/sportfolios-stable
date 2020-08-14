import React from 'react';
import { Card } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import styles from './Games.module.css';
import { Typography } from '@material-ui/core';
import { CARD_TYPE_ENUM } from '../../../../../common/enums';

export default function Games(props) {
  const { t } = useTranslation();
  const { games, changeScore, saveGame } = props;
  return (
    <div className={styles.main}>
      <Typography style={{ marginBottom: '8px' }}>
        {t('games')}
      </Typography>
      {games.map(game => {
        return (
          <Card
            items={{ ...game, changeScore, saveGame }}
            type={CARD_TYPE_ENUM.GAME}
          />
        );
      })}
    </div>
  );
}
