import React from 'react';
import { Icon } from '../../../../components/Custom';
import { Typography } from '../../../../components/MUI';
import { useTranslation } from 'react-i18next';
import styles from './ProTip.module.css';

export default function ProTip() {
  const { t } = useTranslation();

  return (
    <div className={styles.proTip}>
      {window.innerWidth < 768 ? (
        <></>
      ) : (
        <Icon icon="EmojiObjects" color="grey" />
      )}
      <Typography color="textSecondary" variant="body2">
        {t('you_can_click_on_your_game_to_submit_your_score')}
      </Typography>
    </div>
  );
}
