import React, { useState, useEffect } from 'react';

import MailIcon from '@material-ui/icons/Mail';
import IconButton from '@material-ui/core/IconButton';
import { mailTo } from '../../../actions/goTo';

export default function MailtoButton(props) {
  const { emails, subject, message } = props;

  const [emailsFormatted, setEmailsFormatted] = useState('');

  const setEmails = () => {
    emails.map((email, index) => {
      if (index === 0) {
        setEmailsFormatted(`${emailsFormatted}${email.email}`);
      } else {
        setEmailsFormatted(`${emailsFormatted},${email.email}`);
      }
    });
  };

  useEffect(() => {
    setEmails();
  }, [emails]);

  const onClick = () => {
    mailTo(emails, subject, message);
  };

  return (
    <IconButton color="primary" variant="contained" onClick={onClick}>
      <MailIcon />
    </IconButton>
  );
}
