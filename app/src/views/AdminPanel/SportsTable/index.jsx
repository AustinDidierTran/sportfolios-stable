import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Table } from '../../../components/Custom';

import {
  Button,
  Card,
  CardContent,
  CardActions,
  TextField
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

  const validationSchema = Yup.object({
    name: Yup
      .string()
      .required(t('value_is_required')),
    scoreType: Yup
      .number()
      .min(0, 'Should be either 0 or 1')
      .max(1, 'Should be either 0 or 1')
      .required(t('value_is_required'))
  });

  const onCreate = async values => {
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

  const formikCreate = useFormik({
    initialValues: {
      name: '',
      type: 0
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: onCreate,
  })

  useEffect(() => {
    updateSports()
  }, []);

  return (
    <Card className={styles.card}>
      <CardContent className={styles.inputs}>
        <Table
          allowCreate={true}
          formik={formikCreate}
          mode="edit"
          title={t('sports_table_title')}
          headers={[
            { display: 'Name', type: 'text', value: 'name' },
            { display: 'Score Type', initialValue: 1, type: 'number', value: 'scoreType' },
          ]}
          data={sports}
          onCreate={onCreate}
          validationSchema={validationSchema}
        />
      </CardContent>
    </Card>
  )
}