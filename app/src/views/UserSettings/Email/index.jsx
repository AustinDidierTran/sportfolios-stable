import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography } from '../../../components/MUI';
import styles from './Email.module.css';
import { Store } from '../../../Store';
import { API_BASE_URL } from '../../../../../conf';
import ConfirmedEmailField from './ConfirmedEmailField';
import NewEmailField from './NewEmailField';
import UnconfirmedEmailField from './UnconfirmedEmailField';
import _ from 'lodash';

export default function Email(props) {
  const { state: { authToken } } = useContext(Store);
  const [emails, setEmails] = useState([]);

  const { t } = useTranslation();

  const fetchAllEmails = () => {
    fetch(`${API_BASE_URL}/api/user/emails?authToken=${authToken}`)
      .then((res) => res.json())
      .then(({ data }) => {
        setEmails(data);
      });
  }

  useEffect(() => {
    fetchAllEmails();
  }, [])

  const [confirmedEmails, unconfirmedEmails] = _.partition(emails, (email) => email.confirmed_email_at);

  return (
    <Card className={styles.card}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">{t('emails')}</Typography>
        {confirmedEmails.map((email) => <ConfirmedEmailField email={email} isDeletable={confirmedEmails.length > 1} />)}
        {unconfirmedEmails.map((email) => <UnconfirmedEmailField email={email} />)}
        <NewEmailField onSubmit={fetchAllEmails} />
      </CardContent>
    </Card>
  )
}