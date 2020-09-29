import React, { useEffect, useState } from 'react';

import { IgContainer, LoadingSpinner } from '../../components/Custom';

import EntitySearch from './EntitySearch/index';

import api from '../../actions/api';
import { useQuery } from '../../hooks/queries';
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
    <IgContainer>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <EntitySearch query={query} entities={entities} />
      )}
    </IgContainer>
  );
}
