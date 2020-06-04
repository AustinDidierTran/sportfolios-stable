import React, { useContext, useState, useEffect } from 'react';
import { Button } from '../../../components/MUI';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';

export default function StripeAccount(props) {
  const [accountLink, setAccountLink] = useState({});
  const [externalAccount, setExternalAccount] = useState({});
  const { t } = useTranslation();

  const onClickAccountLink = async () => {
    const res = await api(
      `/api/stripe/accountLink?id=349ebb1c-0b63-47e0-a42a-13d20407e2ab`,
    );
    const { data } = res;
    console.log('accountLink', data);
    setAccountLink(data);
  };

  const onClickExternalAccount = async () => {
    const res = await api('/api/stripe/externalAccount', {
      method: 'POST',
      body: JSON.stringify({ allo: 'allo' }),
    });

    const { data } = res;
    console.log('externalAccount', data);
    setExternalAccount(data);
  };

  return (
    <div>
      <Button onClick={onClickAccountLink}>
        Generate Account Link
      </Button>
      <Button onClick={onClickExternalAccount}>
        Add Bank Account
      </Button>
    </div>
  );
}
