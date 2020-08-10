import React from 'react';
import { IgContainer, List } from '../../components/Custom';
import { useApiRoute } from '../../hooks/queries';
import { CircularProgress } from '@material-ui/core';
import { GLOBAL_ENUM } from '../../../../common/enums';
import moment from 'moment';

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

  const formatPurchases = () => {
    const sorted = purchases.sort(
      (a, b) => moment(b.createdAt) - moment(a.createdAt),
    );
    return sorted.map(p => ({
      ...p,
      type: GLOBAL_ENUM.PURCHASES,
    }));
  };

  return (
    <IgContainer>
      <List items={formatPurchases()} />
    </IgContainer>
  );
}
