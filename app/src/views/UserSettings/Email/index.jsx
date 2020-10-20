import React, { useEffect, useState } from 'react';
import { CardContent } from '../../../components/MUI';
import { Paper } from '../../../components/Custom';
import styles from './Email.module.css';
import ConfirmedEmailField from './ConfirmedEmailField';
import NewEmailField from './NewEmailField';
import UnconfirmedEmailField from './UnconfirmedEmailField';
import partition from 'lodash/partition';
import api from '../../../actions/api';

export default function Email() {
  const [emails, setEmails] = useState([]);

  const fetchAllEmails = async () => {
    const { data } = await api('/api/user/emails');
    setEmails(data);
  };

  useEffect(() => {
    fetchAllEmails();
  }, []);

  const [confirmedEmails, unconfirmedEmails] = partition(
    emails,
    email => email.confirmed_email_at,
  );

  return (
    <Paper className={styles.card}>
      <CardContent>
        {confirmedEmails.map((email, index) => (
          <ConfirmedEmailField
            email={email}
            isDeletable={confirmedEmails.length > 1}
            key={index}
          />
        ))}
        {unconfirmedEmails.map((email, index) => (
          <UnconfirmedEmailField email={email} key={index} />
        ))}
        <NewEmailField onSubmit={fetchAllEmails} />
      </CardContent>
    </Paper>
  );
}
