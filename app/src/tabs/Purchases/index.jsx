import React from 'react';
import { List, LoadingSpinner } from '../../components/Custom';
import { useApiRoute } from '../../hooks/queries';
import { LIST_ITEM_ENUM } from '../../../../common/enums';
import moment from 'moment';

export default function PurchasesTab() {
  const { response: purchases, isLoading } = useApiRoute(
    '/api/shop/purchases',
  );
  if (isLoading) {
    return <LoadingSpinner />;
  }

  const formatPurchases = () =>
    purchases
      .sort((a, b) => moment(b.createdAt) - moment(a.createdAt))
      .map((p, index) => ({
        ...p,
        type: LIST_ITEM_ENUM.PURCHASES,
        key: index,
      }));

  return <List items={formatPurchases()} />;
}
