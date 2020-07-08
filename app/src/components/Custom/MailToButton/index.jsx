import React, { useState, useEffect } from 'react';

import MailIcon from '@material-ui/icons/Mail';
import IconButton from '@material-ui/core/IconButton';

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

  const getFormattedMailTo = () => {
    if (emailsFormatted) {
      if (subject) {
        if (message) {
          return (
            `mailto:${emailsFormatted}?subject=` +
            encodeURIComponent(subject) +
            `&body=` +
            encodeURIComponent(message)
          );
        } else {
          return (
            `mailto:${emailsFormatted}?subject=` +
            encodeURIComponent(subject)
          );
        }
      } else {
        return `mailto:${emailsFormatted}`;
      }
    }
  };

  const onClick = () => {
    document.location.href = getFormattedMailTo();
  };

  return (
    <IconButton color="primary" variant="contained" onClick={onClick}>
      <MailIcon />
    </IconButton>
  );
}
