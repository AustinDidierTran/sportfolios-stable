import React, { useEffect, useState } from 'react';

import { Container } from '../../../../../components/Custom';

import UserSearch from '../../../../Search/UserSearch/index';

import styles from './AddAdmins.module.css';
import api from '../../../../../actions/api';

export default function AddAdmins(props) {
  const {
    match: {
      params: { query },
    },
  } = props;

  const [users, setUsers] = useState([]);

  const fetchSearchResults = async () => {
    const {
      data: { users: oUsers },
    } = await api(`/api/data/search/global?query=${query}`);

    setUsers(oUsers);
  };

  useEffect(() => {
    fetchSearchResults();
  }, [query]);

  return (
    <Container className={styles.container}>
      <UserSearch query={query} users={users} />
    </Container>
  );
}
