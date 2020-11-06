import React, { useState } from 'react';

import styles from './Stripe.module.css';
import Stepper from '../../../views/Checkout/Stepper';
import ExternalAccountForm from './Form';
import AccountLink from './AccountLink';
import { useTranslation } from 'react-i18next';

export default function Stripe() {
  const { t } = useTranslation();
  const [next, setNext] = useState(false);

  const steps = [
    {
      label: t('add_personal_information'),
      content: <AccountLink setNext={setNext} />,
    },
    {
      label: t('add_bank_account'),
      content: <ExternalAccountForm setNext={setNext} />,
    },
  ];
  return (
    <div className={styles.main}>
      <Stepper
        steps={steps}
        next={next}
        setNext={setNext}
        showButtons={false}
      />
    </div>
  );
}
