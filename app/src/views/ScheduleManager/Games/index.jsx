import React from 'react';
import { Card } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import styles from './Games.module.css';
import { Typography } from '@material-ui/core';
import { CARD_TYPE_ENUM } from '../../../../../common/enums';

export default function Games(props) {
  const { t } = useTranslation();
  const { games, changeScore, saveGame, getRank } = props;
  return (
    <div className={styles.main}>
      <Typography style={{ marginBottom: '8px' }}>
        {t('games')}
      </Typography>
      {games.map((game, index) => {
        return (
          <Card
            items={{ ...game, changeScore, saveGame, getRank }}
            type={CARD_TYPE_ENUM.EDITABLE_GAME}
            key={index}
          />
        );
      })}
    </div>
  );
}
