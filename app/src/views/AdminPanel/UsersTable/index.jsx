import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '../../../components/MUI';
import styles from './UsersTable.module.css';
import api from '../../../actions/api';

export default function UsersTable() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  const updateUsers = async () => {
    const res = await api('/api/admin/users');

    console.log('res', res);

    setUsers(res.data);
  }

  useEffect(() => {
    updateUsers()
  }, []);

  return (
    <Card className={styles.card}>
      <CardContent className={styles.inputs}>
        <Typography gutterBottom variant="h5" component="h2">{t('users_table_title')}</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Emails</TableCell>
              <TableCell>Is App Admin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.emails.join(', ')}</TableCell>
                <TableCell>{user.app_role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </CardContent>
    </Card>
  )
}