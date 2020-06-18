import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './UserSearch.module.css';

import { Paper } from '../../../components/Custom';

import { List } from '../../../components/Custom';

import { LIST_ROW_TYPE_ENUM } from '../../../../../common/enums';

export default function UserSearch(props) {
  const { t } = useTranslation();

  const { query, persons } = props;

  const items = useMemo(
    () =>
      persons.map(person => ({
        ...person,
        type: LIST_ROW_TYPE_ENUM.PERSON,
      })),
    [persons],
  );

  return (
    <Paper className={styles.card}>
      <List items={items} title={t('users_found_query', { query })} />
    </Paper>
  );
}
