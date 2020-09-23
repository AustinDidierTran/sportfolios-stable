import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Table } from '../../../components/Custom';

import { CardContent, TextField } from '../../../components/MUI';
import { Paper, Button } from '../../../components/Custom';
import styles from './GoogleAnalyticsPageviewsTable.module.css';
import api from '../../../actions/api';
import { useFormik } from 'formik';
import { ERROR_ENUM } from '../../../../../common/errors';

export default function GaPageviewsTable() {
  const { t } = useTranslation();
  const [pageViews, setPageviews] = useState([]);

  const updatePageviews = async () => {
    const res = await api('/api/admin/gaPageviews');

    const newPageviews = res.data.map(d => {
      const onToggle = async event => {
        const res = await api(`/api/admin/gaPageviews/${d.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            enabled: event.target.checked,
          }),
        });

        if (res.status >= 200 && res.status <= 299) {
          updatePageviews();
        }
      };

      return {
        ...d,
        name: d.pathname,
        isChecked: d.enabled,
        handleChange: onToggle,
        color: 'primary',
        inputProps: { 'aria-label': 'secondary checkbox' },
      };
    });

    setPageviews(newPageviews);
  };

  useEffect(() => {
    updatePageviews();
  }, []);

  const validate = values => {
    const { newPathname } = values;
    const errors = {};

    if (!newPathname) {
      errors.newPathname = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    } else if (!newPathname.startsWith('/')) {
      errors.newPathname = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      newPathname: '',
    },
    validate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      const { newPathname } = values;
      const res = await api('/api/admin/gaPageview', {
        method: 'POST',
        body: JSON.stringify({
          pathname: newPathname,
          enabled: true,
        }),
      });
      if (res.status >= 200 && res.status <= 299) {
        updatePageviews();
      }
      resetForm();
    },
  });

  const headers = [
    { display: t('pathname'), value: 'pathname' },
    {
      display: t('status'),
      type: 'toggle',
      value: 'enabled',
    },
  ];

  return (
    <Paper className={styles.card}>
      <CardContent className={styles.inputs}>
        <Table
          title={t('ga_pageviews_table_title')}
          headers={headers}
          data={pageViews}
        />
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.addPageview}>
            <TextField
              id="newPathname"
              namespace="newPathname"
              variant="outlined"
              label={t('add') + ' ' + t('pathname')}
              placeholder="/sportfoliosRoute"
              formik={formik}
            ></TextField>
            <Button
              className={styles.button}
              size="medium"
              variant="contained"
              endIcon="Add"
              style={{ margin: '8px', maxHeight: '40px' }}
              type="submit"
            >
              {t('add')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Paper>
  );
}
