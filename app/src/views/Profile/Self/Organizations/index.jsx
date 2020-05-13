import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Organizations.module.css';
import { TextField, Card } from '../../../../components/MUI';

export default function Organizations(props) {
  const { t } = useTranslation();

  return (
    <Card className={styles.card}>
      <>
        <h2 className={styles.title}>{t('organizations')}</h2>
        <TextField
          disabled
          value={"Association d'Ultimate de Sherbrooke (AUS)"}
          className={styles.textField}
        />
      </>
    </Card>
  );
}
