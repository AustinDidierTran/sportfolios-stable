import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import {
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CardActions
} from '../../../components/MUI';
import styles from './SportsTable.module.css';
import api from '../../../actions/api';

export default function SportsTable() {
  const { t } = useTranslation();
  const [sports, setSports] = useState([]);

  const updateSports = async () => {
    const res = await api('/api/admin/sports');

    setSports(res.data);
  }

  const validate = (values) => {
    return {};
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      type: 0
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { name, scoreType } = values;
      const res = await api('/api/admin/sport', {
        method: 'POST',
        body: JSON.stringify({
          name,
          scoreType,
        })
      })
      if (res.status <= 299) {
        updateSports();
      }
    }
  })

  useEffect(() => {
    updateSports()
  }, []);

  return (
    <Card className={styles.card}>
      <CardContent className={styles.inputs}>
        <Typography gutterBottom variant="h5" component="h2">{t('sports_table_title')}</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sport ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Score Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sports.map((sport) => (
              <TableRow key={sport.id}>
                <TableCell>{sport.id}</TableCell>
                <TableCell>{sport.name}</TableCell>
                <TableCell>{sport.score_type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <form onSubmit={formik.handleSubmit}>
        <CardActions className={styles.actions}>
          <TextField
            className={styles.sport}
            namespace="name"
            formik={formik}
            type="text"
            label="Name"
          />
          <TextField
            className={styles.scoreType}
            namespace="scoreType"
            formik={formik}
            type="number"
            label="Type"
          />
          <Button
            className={styles.input}
            type="submit"
            color="primary"
            variant="contained">Create new sport</Button>
        </CardActions>
      </form>
    </Card>
  )
}