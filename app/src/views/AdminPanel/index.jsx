import React from 'react';

import { useTranslation } from 'react-i18next';

import styles from './AdminPanel.module.css';

import { Typography, Container } from '../../components/MUI';
import SportsTable from './SportsTable';
import UsersTable from './UsersTable';

export default function AdminPanel() {
  const { t } = useTranslation();

  return (
    <Container className={styles.container}>
      <Typography
        variant="h3"
        className={styles.title}
        style={{ marginTop: 24 }}
      >
        {t('admin_panel')}
      </Typography>
      <UsersTable />
      <SportsTable />
    </Container>
  );
}
