import React, { useEffect, useState } from 'react';

import { Container } from '../../components/Custom';

import UserSearch from './UserSearch/index';

import styles from './Search.module.css';
import api from '../../actions/api';
import { useQuery } from '../../hooks/queries';
import { CircularProgress } from '@material-ui/core';

export default function Search() {
  const { query } = useQuery();

  const [isLoading, setIsLoading] = useState(false);
  const [persons, setPersons] = useState([]);
  const [timeoutRef, setTimeoutRef] = useState(null);
  const asyncFetchResult = async () => {
    const {
      data: { users },
    } = await api(`/api/data/search/global?query=${query}`);

    setPersons(users);

    setTimeoutRef(null);
    setIsLoading(false);
  };

  const fetchSearchResults = () => {
    setIsLoading(true);
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }
    setTimeoutRef(setTimeout(asyncFetchResult, 1000));
  };

  useEffect(() => {
    fetchSearchResults();
  }, [query]);

  return (
    <Container className={styles.container}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <UserSearch query={query} persons={persons} />
      )}
    </Container>
  );
}
