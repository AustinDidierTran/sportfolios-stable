import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from '../../../components/Custom';

import { Card, CardContent, TableBody, TableCell, TableHead, TableRow, Typography } from '../../../components/MUI';
import styles from './UsersTable.module.css';
import api from '../../../actions/api';

export default function UsersTable() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  const updateUsers = async () => {
    const res = await api('/api/admin/users');

    setUsers(res.data.map((user) => ({
      ...user,
      emails: user.emails.join(', ')
    })));
  }

  useEffect(() => {
    updateUsers()
  }, []);

  const headers = [
    { display: 'First Name', value: 'first_name' },
    { display: 'Last Name', value: 'last_name' },
    { display: 'Emails', value: 'emails' },
    { display: 'App Role', value: 'app_role' },
  ]

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
  )
}