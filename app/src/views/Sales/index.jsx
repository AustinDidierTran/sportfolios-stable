import React from 'react';
import { IgContainer, Paper } from '../../components/Custom';
import { useApiRoute } from '../../hooks/queries';
import { CircularProgress } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { formatPrice } from '../../utils/stringFormats';

export default function Sales() {
  const { id } = useParams();
  const { isLoading, response } = useApiRoute(
    `/api/shop/sales?id=${id}`,
  );

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
      <Paper>
        {response.map(r => (
          <>
            <div>
              <p>{r.label}</p>
              <p>{r.description}</p>
              <p>{formatPrice(r.amount)}</p>
              <p>{r.quantity}</p>
              <p>{r.metadata.size}</p>
              <p>{r.email}</p>
            </div>
            <hr />
          </>
        ))}
      </Paper>
    </IgContainer>
  );
}
