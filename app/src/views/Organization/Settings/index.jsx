import React from 'react';
import Stepper from './Stripe/Stepper';
import ManageRoles from './ManageRoles';
import { AccountLink } from '../../../utils/stripe/ExternalAccount';
import ExternalAccountForm from './Stripe/Form';
import { Typography, Container } from '../../../components/MUI';
import { useParams } from 'react-router-dom';
import styles from './Settings.module.css';

function AccountLinkComponent(props) {
  //TODO: Add an api call to know if account has already been linked (stripe_accounts) maybe?
  const disabled = false;
  const { id } = props;
  return (
    <div>
      {disabled ? <Typography>Account linked!</Typography> : null}
      <AccountLink disabled={disabled} id={id} />
    </div>
  );
}

export default function OrganizationSettings(props) {
  const { id } = useParams();
  const steps = [
    {
      label: 'Add personal information',
      content: <AccountLinkComponent id={id} />,
    },
    {
      label: 'Add bank account',
      content: <ExternalAccountForm />,
    },
  ];

  return (
    <Container className={styles.main}>
      <Stepper steps={steps}></Stepper>
      <ManageRoles />
    </Container>
  );
}

// http://localhost:3000/organization/e7a9a635-5d63-4f04-b063-a2d323d4f63e/settings
