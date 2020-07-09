import React from 'react';
import { Button } from '../../../components/MUI';
import api from '../../../actions/api';
import { useEffect } from 'react';
import { formatRoute } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';

export default function AccountLink(props) {
  const { disabled, setNext, id } = props;
  const { t } = useTranslation();

  const onClick = async () => {
    const { data } = await api(
      formatRoute('/api/stripe/accountLink', null, { id }),
    );
    setNext(true);
    window.location.href = data.url;
  };

  const fetchAccount = async () => {
    const account = await api(
      formatRoute('/api/stripe/getStripeAccountId', null, { id }),
    );
    if (account) {
      setNext(true);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <Button disabled={disabled} onClick={onClick}>
      {t('generate_account_link')}
    </Button>
  );
}
