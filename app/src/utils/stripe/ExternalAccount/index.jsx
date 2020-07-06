import React from 'react';
import { Button } from '../../../components/MUI';
import api from '../../../actions/api';
import { useEffect } from 'react';

export default function AccountLink(props) {
  const { disabled, setNext, id } = props;

  const onClick = async () => {
    const { data } = await api(`/api/stripe/accountLink?id=${id}`);
    setNext(true);
    window.location.href = data.url;
  };

  const fectchAccount = async () => {
    const account = await api(
      `/api/stripe/getStripeAccountId?id=${id}`,
    );
    if (account) setNext(true);
  };
  useEffect(() => {
    fectchAccount();
  }, []);

  return (
    <Button disabled={disabled} onClick={onClick}>
      Generate Account Link
    </Button>
  );
}
