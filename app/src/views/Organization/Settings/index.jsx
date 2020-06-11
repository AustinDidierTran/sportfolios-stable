import React from 'react';
import Stripe from './Stripe';
import ManageRoles from './ManageRoles';
import { AccountLink } from '../../../utils/stripe/ExternalAccount';
import { Typography, Container } from '../../../components/MUI';
import { useParams } from 'react-router-dom';
import styles from './Settings.module.css';

export default function OrganizationSettings(props) {
  const { id } = useParams();

  return (
    <div className={styles.main}>
      <Stripe id={id} />
      <ManageRoles />
    </div>
  );
}

// http://localhost:3000/organization/e7a9a635-5d63-4f04-b063-a2d323d4f63e/settings
