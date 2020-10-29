import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './EntitySearch.module.css';

import { Paper } from '../../../components/Custom';

import { List } from '../../../components/Custom';

export default function EntitySearch(props) {
  const { t } = useTranslation();

  const { query, entities } = props;

  const items = useMemo(
    () =>
      entities.map(entity => ({
        ...entity,
        key: entity.id,
      })),
    [entities],
  );

  return (
    <Paper
      className={styles.card}
      title={t('search_results', { query })}
    >
      <List items={items} />
    </Paper>
  );
}
