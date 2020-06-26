import React, { useEffect, useState } from 'react';

import { Paper } from '../../../components/Custom';
import { Container } from '../../../components/MUI';

import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { useParams } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import DataCard from './DataCard';
import CreateCard from './CreateCard';
import styles from './AddOptionsEvent.module.css';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AddOptionsEvent() {
  const { t } = useTranslation();

  const { id } = useParams();

  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [display, setDislpay] = useState('');

  useEffect(() => {
    getOptions();
  }, [id]);

  const getOptions = async () => {
    const res = await api(`/api/entity/options/?id=${id}`);
    const data = res.data.map(d => Object.values(d));
    setOptions(data);
  };

  const onAdd = async values => {
    const name = values[0].value;
    const price = Number(values[1].value);
    const start_time = values[2].value;
    const end_time = values[3].value;
    if (start_time >= end_time) {
      setDislpay('Registration closes before opening');
      setOpen(true);
    } else {
      const res = await api(`/api/entity/option`, {
        method: 'POST',
        body: JSON.stringify({
          event_id: id,
          name,
          price,
          end_time,
          start_time,
        }),
      });
      if (res.status === 400) {
        setDislpay('payment_option_exist');
        setOpen(true);
        return;
      } else {
        getOptions();
      }
    }
  };

  const onDelete = async id => {
    await api(
      formatRoute('/api/entity/option', null, {
        id,
      }),
      {
        method: 'DELETE',
      },
    );
    getOptions();
  };

  const onSave = async () => {};

  const headers = [
    {
      display: t('name'),
      value: 0,
    },
    {
      display: t('price'),
      value: 1,
      type: 'number',
    },
    {
      helperText: t('registration_open'),
      type: 'date',
      value: 2,
    },
    {
      helperText: t('registration_close'),
      type: 'date',
      value: 3,
    },
  ];

  return (
    <Paper title={t('add_payment_options')}>
      <Container className={styles.container}>
        {options.map((o, index) => (
          <DataCard
            headers={headers}
            data={o}
            onSave={onSave}
            index={index}
            onDelete={onDelete}
          ></DataCard>
        ))}
        <CreateCard headers={headers} onAdd={onAdd} />
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => {
            setOpen(false);
          }}
        >
          <Alert
            onClose={() => {
              setOpen(false);
            }}
            severity="error"
          >
            {display}
          </Alert>
        </Snackbar>
      </Container>
    </Paper>
  );
}
