import React, { useState } from 'react';
import { Button } from '../../../components/MUI';
import api from '../../../actions/api';

export function AccountLink(props) {
  const [accountLink, setAccountLink] = useState({});

  const onClick = async () => {
    const { id } = props;
    console.log('id', id);
    const res = await api(`/api/stripe/accountLink?id=${id}`);
    const { data } = res;
    console.log('accountLink', data);
    setAccountLink(data);
    window.location.href = data.url;
  };

  return <Button onClick={onClick}>Generate Account Link</Button>;
}

export function ExternalAccount(props) {
  const { id } = props;
  const [externalAccount, setExternalAccount] = useState({});
  const onClick = async () => {
    const res = await api('/api/stripe/externalAccount', {
      method: 'POST',
      body: JSON.stringify({ id: id }),
    });

    const { data } = res;
    console.log('externalAccount', data);
    setExternalAccount(data);
  };

  return <Button onClick={onClick}>Add Bank Account</Button>;
}
