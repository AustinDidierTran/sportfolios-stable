import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Typography,
} from '../../../components/MUI';
import styles from './Email.module.css';
import ConfirmedEmailField from './ConfirmedEmailField';
import NewEmailField from './NewEmailField';
import UnconfirmedEmailField from './UnconfirmedEmailField';
import _ from 'lodash';
import api from '../../../actions/api';

export default function Email() {
  const [emails, setEmails] = useState([]);

  const { t } = useTranslation();

  const fetchAllEmails = async () => {
    const { data } = await api('/api/user/emails');
    setEmails(data);
  };

  useEffect(() => {
    fetchAllEmails();
  }, []);

  const [confirmedEmails, unconfirmedEmails] = _.partition(
    emails,
    email => email.confirmed_email_at,
  );

  return (
    <Card className={styles.card}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {t('emails')}
        </Typography>
        {confirmedEmails.map(email => (
          <ConfirmedEmailField
            email={email}
            isDeletable={confirmedEmails.length > 1}
          />
        ))}
        {unconfirmedEmails.map(email => (
          <UnconfirmedEmailField email={email} />
        ))}
        <NewEmailField onSubmit={fetchAllEmails} />
      </CardContent>
    </Card>
  );
}
