import React, { useState, useEffect } from 'react';
import styles from './More.module.css';
import history from '../../stores/history';
import { ROUTES } from '../../actions/goTo/index';
import { useTranslation } from 'react-i18next';

import { Paper } from '../../components/MUI';
import { Typography } from '@material-ui/core';

export default function Menu(props) {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <Paper
        elevation={0}
        className={styles.card}
        onClick={() => history.push(ROUTES.userSettings)}
      >
        <Typography>{t('settings')}</Typography>
      </Paper>
      <Paper
        elevation={0}
        className={styles.card}
        onClick={() => history.push(ROUTES.userSettings)}
      >
        <Typography style={{ color: 'red' }}>
          {t('logout')}
        </Typography>
      </Paper>
    </div>
  );
}
