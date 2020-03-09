import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography } from '../../../components/MUI';
import styles from './Email.module.css';
import { Store } from '../../../Store';
import { API_BASE_URL } from '../../../../../conf';

export default function Email(props) {
  const { state: { authToken } } = useContext(Store);
  const [emails, setEmails] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    // fetch all emails
    fetch(`${API_BASE_URL}/api/user/emails?authToken=${authToken}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('data', data);
        ;
      });

  }, [])
  return (
    <Card className={styles.card}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">{t('emails')}</Typography>
      </CardContent>
    </Card>
  )
}