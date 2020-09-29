import React, { useState, useEffect } from 'react';

import MailIcon from '@material-ui/icons/Mail';
import { IconButton, Tooltip } from '@material-ui/core';
import { mailTo } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';

export default function MailtoButton(props) {
  const { t } = useTranslation();
  const { emails, subject, message } = props;

  const [emailsFormatted, setEmailsFormatted] = useState([]);

  useEffect(
    () => setEmailsFormatted(emails.map(email => email.email)),
    [emails],
  );
  const onClick = () => {
    mailTo(emailsFormatted, subject, message);
  };

  return (
    <Tooltip title={t('send_email')}>
      <IconButton
        color="primary"
        variant="contained"
        onClick={onClick}
      >
        <MailIcon />
      </IconButton>
    </Tooltip>
  );
}
