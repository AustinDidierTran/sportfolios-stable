import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from '../../../components/Custom';

import { Card, CardContent } from '../../../components/MUI';
import styles from './UsersTable.module.css';
import api from '../../../actions/api';

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
    { display: t('first_name'), value: 'first_name' },
    { display: t('last_name'), value: 'last_name' },
    { display: t('emails'), value: 'emails' },
    { display: t('app_role'), value: 'app_role' },
  ];

  return (
    <Card className={styles.card}>
      <CardContent className={styles.inputs}>
        <Table
          data={users}
          headers={headers}
          title={t('users_table_title')}
        />
      </CardContent>
    </Card>
  );
}
