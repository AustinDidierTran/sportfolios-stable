import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './History.module.css';
import { TextField } from '../../../../../components/MUI';

export default function History(props) {
  const { t } = useTranslation();
  return (
    <TextField
      namespace="History"
      label={t('history')}
      className={styles.TextField}
    />
  );
}
