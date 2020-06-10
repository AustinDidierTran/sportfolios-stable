import React, { useState } from 'react';
import { Button } from '../../../components/MUI';
import api from '../../../actions/api';

export function AccountLink(props) {
  const { disabled } = props;

  const onClick = async () => {
    const { id } = props;
    const res = await api(`/api/stripe/accountLink?id=${id}`);
    const { data } = res;
    console.log('accountLink', data);
    window.location.href = data.url;
  };

  return (
    <Button disabled={disabled} onClick={onClick}>
      Generate Account Link
    </Button>
  );
}
