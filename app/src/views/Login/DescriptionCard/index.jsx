import React, { useState } from 'react';

import styles from './DescriptionCard.module.css';

import {
  CardContent,
  Typography,
  Button,
} from '../../../components/MUI';
import { Paper } from '../../../components/Custom';

import { useTranslation } from 'react-i18next';

export default function DescriptionCard() {
  const { t } = useTranslation();
  const [isPressed, setIsPressed] = useState(false);

  const onPressed = () => {
    setIsPressed(!isPressed);
  };

  if (!isPressed) {
    return <Button onClick={onPressed}>Learn More</Button>;
  }
  return (
    <Paper
      className={styles.description}
      title={t('description_card_title')}
    >
      <CardContent className={styles.content}>
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
      <div className={styles.buttonDiv}>
        <Button className={styles.button} onClick={onPressed}>
          Close
        </Button>
      </div>
    </Paper>
  );
}
