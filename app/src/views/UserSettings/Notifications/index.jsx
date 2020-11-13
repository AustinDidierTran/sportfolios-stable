import React from 'react';
import { Card } from '@material-ui/core';
import { List } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import styles from './Notifications.module.css';
export default function Notifications(props) {
  const { t } = useTranslation();

  return (
    <Card className={styles.card}>
      <List title={t('Notifications')}></List>
    </Card>
  );
}
