import React, { useContext, useState, useEffect } from 'react';
import {
  AccountLink,
  ExternalAccount,
} from '../../../utils/stripe/ExternalAccount';
import { useParams } from 'react-router-dom';

export default function OrganizationSettings(props) {
  const { id } = useParams();
  return (
    <div>
      <AccountLink id={id} />
      <ExternalAccount id={id} />
    </div>
  );
}
