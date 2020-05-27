import React from 'react';

import styles from './DescriptionCard.module.css';

import { CardContent, Typography } from '../../../components/MUI';
import { Paper } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';

export default function DescriptionCard() {
  const { t } = useTranslation();

  return (
    <Paper className={styles.description}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {t('description_card_title')}
        </Typography>
        <Typography gutterBottom variant="h6" component="h2">
          {t('description_card_first_point')}
        </Typography>
        <Typography gutterBottom variant="h6" component="h2">
          {t('description_card_second_point')}
        </Typography>
        <Typography gutterBottom variant="h6" component="h2">
          {t('description_card_third_point')}
        </Typography>
      </CardContent>
    </Paper>
  );
}
