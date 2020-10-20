import React, { useState, useEffect } from 'react';

import styles from './General.module.css';

import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { Card, LoadingSpinner } from '../../../components/Custom';

const getAllPosts = async () => {
  const { data } = await api(
    formatRoute('/api/entity/forYouPage', null),
  );
  return data || [];
};

export default function General() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState([true]);

  const getData = async () => {
    setIsLoading(true);
    const posts = await getAllPosts();
    setPosts(posts);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className={styles.general}>
      {posts.map((e, index) => {
        return (
          <Card
            type={e.cardType}
            items={{ ...e, update: getData }}
            key={index}
          />
        );
      })}
    </div>
  );
}
