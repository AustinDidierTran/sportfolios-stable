import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Table } from '../../../components/Custom';

import { CardContent } from '../../../components/MUI';
import { Paper } from '../../../components/Custom';
import styles from './GoogleAnalyticsPageviewsTable.module.css';
import api from '../../../actions/api';

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

        if (res.status <= 299) {
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
      </CardContent>
    </Paper>
  );
}
