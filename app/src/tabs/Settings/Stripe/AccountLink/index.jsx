import React from 'react';

import AccountLink from '../../../../utils/stripe/ExternalAccount';
import { Typography } from '../../../../components/MUI';

export default function AccountLinkComponent(props) {
  //TODO: Add an api call to know if account has already been linked (stripe_accounts) maybe?
  const disabled = false;
  const { setNext } = props;
  return (
    <div>
      {disabled ? <Typography>Account linked!</Typography> : null}
      <AccountLink disabled={disabled} setNext={setNext} />
    </div>
  );
}
