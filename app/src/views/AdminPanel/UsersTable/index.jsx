import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Paper } from '../../../components/Custom';

import { CardContent } from '../../../components/MUI';
import styles from './UsersTable.module.css';
import api from '../../../actions/api';
import history from '../../../stores/history';

export default function UsersTable() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  const updateUsers = async () => {
    const res = await api('/api/admin/users');

    setUsers(
      res.data.map(user => ({
        ...user,
        emails: user.emails.join(', '),
      })),
    );
  };

  useEffect(() => {
    updateUsers();
  }, []);

  const headers = [
    { display: t('name'), value: 'name' },
    { display: t('surname'), value: 'surname' },
    { display: t('emails'), value: 'emails' },
    { display: t('app_role'), value: 'app_role' },
  ];

  return (
    <Paper className={styles.card}>
      <CardContent className={styles.inputs}>
        <Table
          data={users}
          headers={headers}
          onRowClick={d => () => history.push(`/profile/${d.id}`)}
          title={t('users_table_title')}
        />
      </CardContent>
    </Paper>
  );
}
