import React from 'react';
import { IgContainer, List } from '../../components/Custom';
import { useApiRoute } from '../../hooks/queries';
import { CircularProgress } from '@material-ui/core';
import { GLOBAL_ENUM } from '../../../../common/enums';

export default function PurchasesTab() {
  const { response: purchases, isLoading } = useApiRoute(
    '/api/shop/purchases',
  );

  if (isLoading) {
    return (
      <IgContainer>
        <CircularProgress />
      </IgContainer>
    );
  }

  return (
    <IgContainer>
      <List
        items={purchases.map(p => ({
          ...p,
          type: GLOBAL_ENUM.PURCHASES,
        }))}
      />
    </IgContainer>
  );
}
