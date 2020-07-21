import React, { useState, useEffect } from 'react';

import MailIcon from '@material-ui/icons/Mail';
import IconButton from '@material-ui/core/IconButton';
import { mailTo } from '../../../actions/goTo';

export default function MailtoButton(props) {
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
    <IconButton color="primary" variant="contained" onClick={onClick}>
      <MailIcon />
    </IconButton>
  );
}
