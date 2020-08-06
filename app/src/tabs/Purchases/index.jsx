import React from 'react';
import { IgContainer } from '../../components/Custom';
import { useApiRoute } from '../../hooks/queries';
import { CircularProgress } from '@material-ui/core';

export default function PurchasesTab() {
  const { response: purchases, isLoading } = useApiRoute(
    '/api/shop/purchases',
  );

  // TODO: JULIEN FAIS TA JOB

  if (isLoading) {
    return (
      <IgContainer>
        <CircularProgress />
      </IgContainer>
    );
  }

  return (
    <IgContainer>
      <div>Hello World!</div>
    </IgContainer>
  );
}
