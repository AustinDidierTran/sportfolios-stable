import React, { useEffect } from 'react';
import { Button } from '../../../components/MUI';
import api from '../../../actions/api';
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
    const { data: account } = await api(
      formatRoute('/api/stripe/getStripeAccount', null, { id }),
    );
    if (account.account_id) {
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
