import React, { useEffect, useState } from 'react';

const useFollowingUserInformations = async () => {
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

  return { users };
};

export const useAllMainInformations = async () => {
  const users = useFollowingUserInformations();

  return { users };
};
