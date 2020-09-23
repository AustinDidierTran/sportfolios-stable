import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Table } from '../../../components/Custom';

import { CardContent } from '../../../components/MUI';
import { Paper } from '../../../components/Custom';
import styles from './GoogleAnalyticsEventsTable.module.css';
import api from '../../../actions/api';

export default function GaEventsTable() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);

  const updateEvents = async () => {
    const res = await api('/api/admin/gaEvents');

    const newEvents = res.data.map(d => {
      const onToggle = async event => {
        const res = await api(`/api/admin/gaEvents/${d.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            enabled: event.target.checked,
          }),
        });

        if (res.status <= 299) {
          updateEvents();
        }
      };

      return {
        ...d,
        name: d.category,
        isChecked: d.enabled,
        handleChange: onToggle,
        color: 'primary',
        inputProps: { 'aria-label': 'secondary checkbox' },
      };
    });

    setEvents(newEvents);
  };

  useEffect(() => {
    updateEvents();
  }, []);

  const headers = [
    { display: t('category'), value: 'category' },
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
          title={t('ga_events_table_title')}
          headers={headers}
          data={events}
        />
      </CardContent>
    </Paper>
  );
}
