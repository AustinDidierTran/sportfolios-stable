import React, { useEffect, useState } from 'react';

import { Container } from '../../components/Custom';

import _ from 'lodash';

import UserSearch from './UserSearch/index';

import styles from './Search.module.css';
import api from '../../actions/api';
import { useQuery } from '../../hooks/queries';

export default function Search() {
  const { query } = useQuery();

  const [persons, setPersons] = useState([]);
  const asyncFetchResult = async () => {
    const {
      data: { users },
    } = await api(`/api/data/search/global?query=${query}`);

    setPersons(users);
  };

  const fetchSearchResults = _.debounce(() => {
    asyncFetchResult();
  }, 3000);

  useEffect(() => {
    fetchSearchResults.cancel();
    fetchSearchResults();
  }, [query]);

  return (
    <Container className={styles.container}>
      <UserSearch query={query} persons={persons} />
    </Container>
  );
}
