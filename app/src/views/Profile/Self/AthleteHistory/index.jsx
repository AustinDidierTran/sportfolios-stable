import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './AthleteHistory.module.css';
import { TextField, Card } from '../../../../components/MUI';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

export default function AthleteHistory(props) {
  const { t } = useTranslation();

  return (
    <Card className={styles.card}>
      <h2 className={styles.title}>{t('athlete_history')}</h2>
      <div className={styles.container}>
        <TextField
          disabled
          namespace="AthleteHistory"
          value={'Champion Canadien'}
          className={styles.textField}
        />
        <span>
          <FormControlLabel
            className={styles.switch}
            control={<Switch color="primary" />}
            label="Show to everyone"
          />
        </span>
      </div>
    </Card>
  );
}
