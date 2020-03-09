import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography } from '../../../components/MUI';
import styles from './Email.module.css';

export default function Email(props) {
  const { t } = useTranslation();
  return (
    <Card className={styles.card}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">{t('emails')}</Typography>
      </CardContent>
    </Card>
  )
}