import { useEffect, useState } from 'react';

import api from '../../api';

const useFollowingUserInformations = () => {
  const [users, setUsers] = useState([]);

  const init = async () => {
    const {
      data: { users: oUsers },
    } = await api('/api/data/main/all');

    setUsers(oUsers);
  };

  useEffect(() => {
    init();
  }, []);

  return users;
};

export const useAllMainInformations = () => {
  const users = useFollowingUserInformations();

  return { users };
};

export const createRefund = async ({ invoiceItemId }) => {
  const data = await api('/api/stripe/createRefund', {
    method: 'POST',
    body: JSON.stringify({ invoiceItemId }),
  });

  return data;
};
