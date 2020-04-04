import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, Typography } from '../../../components/MUI';
import styles from './UsersTable.module.css';
import api from '../../../actions/api';
import { Store } from '../../../Store';

export default function UsersTable() {
  const { t } = useTranslation();
  const { state: { authToken } } = useContext(Store);

  useEffect(() => {
    console.log('inside useeffect')
    api('/api/admin/users', { authToken }).then(data => console.log('data', data));
  }, []);

  return (
    <Card className={styles.card}>
      <CardContent className={styles.inputs}>
        <Typography gutterBottom variant="h5" component="h2">{t('users_table_title')}</Typography>
      </CardContent>
    </Card>
  )
}