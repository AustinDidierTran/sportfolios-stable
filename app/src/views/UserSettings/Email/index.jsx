import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CardContent } from '../../../components/MUI';
import { Paper } from '../../../components/Custom';
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
    <Paper className={styles.card} title={t('emails')}>
      <CardContent>
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
    </Paper>
  );
}
