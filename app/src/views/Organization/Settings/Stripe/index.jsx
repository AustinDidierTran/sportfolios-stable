import React, { useParams } from 'react';

import styles from './Stripe.module.css';
import Stepper from './Stepper';
import ExternalAccountForm from './Form';
import AccountLink from './AccountLink';

export default function Stripe(props) {
  const { id } = props;

  const steps = [
    {
      label: 'Add personal information',
      content: <AccountLink id={id} />,
    },
    {
      label: 'Add bank account',
      content: <ExternalAccountForm />,
    },
  ];
  return (
    <div className={styles.main}>
      <Stepper steps={steps} />
    </div>
  );
}
