import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Teams.module.css';
import { TextField, Card } from '../../../../components/MUI';

export default function Teams(props) {
  const { t } = useTranslation();

  return (
    <Card className={styles.card}>
      <h2 className={styles.title}>{t('teams')}</h2>

      <TextField
        disabled
        value={"Sherbrooke Gentlemen's Club (SGC)"}
        className={styles.textField}
      />
    </Card>
  );
}
