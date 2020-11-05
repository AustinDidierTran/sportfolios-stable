import React, { useState, useEffect } from 'react';

import IconButton from '../IconButton';
import { mailTo } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';

export default function MailtoButton(props) {
  const { t } = useTranslation();
  const { emails, subject, message, color = 'primary' } = props;

  const [emailsFormatted, setEmailsFormatted] = useState([]);

  useEffect(() => {
    setEmailsFormatted(emails.map(email => email.email));
  }, [emails]);
  const onClick = () => {
    mailTo(emailsFormatted, subject, message);
  };

  return (
    <IconButton
      variant="contained"
      onClick={onClick}
      icon="Mail"
      tooltip={t('send_email')}
      style={{ color: color }}
    ></IconButton>
  );
}
