import React from 'react';
import { IgContainer, List } from '../../components/Custom';
import { useApiRoute } from '../../hooks/queries';
import { CircularProgress } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { GLOBAL_ENUM } from '../../../../common/enums';
import moment from 'moment';

export default function Sales() {
  const { id } = useParams();
  const { isLoading, response } = useApiRoute(
    `/api/shop/sales?id=${id}`,
  );

  const formatSales = () => {
    const sorted = response.sort(
      (a, b) => moment(b.createdAt) - moment(a.createdAt),
    );
    return sorted.map(s => ({
      ...s,
      type: GLOBAL_ENUM.SALES,
    }));
  };

  if (isLoading) {
    return (
      <IgContainer>
        <CircularProgress />
      </IgContainer>
    );
  }

  if (!response) {
    return <></>;
  }
  return (
    <IgContainer>
      <List items={formatSales()} />
    </IgContainer>
  );
}
