import React, { useEffect, useState } from 'react';

import api from '../index';

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
