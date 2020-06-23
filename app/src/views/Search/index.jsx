import React, { useEffect, useState } from 'react';

import { Container } from '../../components/Custom';

import EntitySearch from './EntitySearch/index';

import styles from './Search.module.css';
import api from '../../actions/api';
import { useQuery } from '../../hooks/queries';
import { CircularProgress } from '@material-ui/core';
import { formatRoute } from '../../actions/goTo';

export default function Search(props) {
  const { query } = useQuery();

  const { type } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [entities, setEntities] = useState([]);
  const [timeoutRef, setTimeoutRef] = useState(null);
  const asyncFetchResult = async () => {
    const res = await api(
      formatRoute('/api/data/search/global', null, { query, type }),
    );

    setEntities(res.data.entities);

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
        <EntitySearch query={query} entities={entities} />
      )}
    </Container>
  );
}
