import React from 'react';

import { useTranslation } from 'react-i18next';

import styles from './AdminPanel.module.css';

import { Typography, Container } from '../../components/MUI';
import UsersTable from './UsersTable';

export default function AdminPanel() {
  const { t } = useTranslation();

  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <Typography variant='h3' className={styles.title} style={{ marginTop: 32 }}>{t('admin_panel')}</Typography>
        <UsersTable />
      </Container>
    </div>
  );
}
