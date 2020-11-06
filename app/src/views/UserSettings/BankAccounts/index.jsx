import React, { useEffect, useState } from 'react';
import {
  List,
  LoadingSpinner,
  Button,
} from '../../../components/Custom';
import styles from './BankAccounts.module.css';
import { Card } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import AccountLink from '../../../utils/stripe/ExternalAccount';
import ExternalAccountForm from '../../../tabs/Settings/Stripe/Form';
import { formatRoute, goTo, ROUTES } from '../../../actions/goTo';

export default function BankAccounts() {
  const { t } = useTranslation();

  const [bankAccounts, setBankAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getBankAccounts();
  }, []);

  const getBankAccounts = async () => {
    setIsLoading(true);
    const { data } = await api(
      formatRoute('/api/stripe/bankAccounts'),
    );
    console.log({ data });
    setBankAccounts(data);
    setIsLoading(false);
  };

  const hasStripeAccount = async () => {
    const { data } = await api(
      formatRoute('/api/stripe/hasStripeAccount'),
    );
    return data;
  };

  const handleClick = async () => {
    if (await hasStripeAccount()) {
      goTo(ROUTES.addBankAccount);
    } else {
      const { data } = await api(
        formatRoute('/api/stripe/accountLink'),
      );
      console.log({ data });
      window.location.href = data.url;
    }
  };

  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }
  return (
    <Card className={styles.card}>
      <List title={t('bank_accounts')} items={bankAccounts}></List>
      <Button
        color="primary"
        onClick={handleClick}
        style={{ margin: '8px' }}
      >
        {t('add_bank_account')}
      </Button>
    </Card>
  );
}
