import React, { useEffect, useState } from 'react';

import { Paper, Card } from '../../../components/Custom';
import { Container } from '../../../components/MUI';

import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { useParams } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import styles from './AddOptionsEvent.module.css';
import { CARD_TYPE_ENUM } from '../../../../../common/enums';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AddOptionsEvent() {
  const { t } = useTranslation();

  const { id: event_id } = useParams();

  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState('');

  useEffect(() => {
    getOptions();
  }, [event_id]);

  const getOptions = async () => {
    const { data } = await api(
      formatRoute('/api/entity/options', null, { event_id }),
    );
    const dataOptions = data.map(d => Object.values(d));
    setOptions(dataOptions);
  };

  const onAdd = async values => {
    const name = values[0].value;
    const price = Number(values[1].value);
    const start_time = values[2].value;
    const end_time = values[3].value;
    if (start_time >= end_time) {
      setDisplay(t('registration_closes_before_opening'));
      setOpen(true);
      return;
    }
    const res = await api(`/api/entity/option`, {
      method: 'POST',
      body: JSON.stringify({
        event_id,
        name,
        price,
        end_time,
        start_time,
      }),
    });
    if (res.status === 400) {
      setDisplay(t('payment_option_exist'));
      setOpen(true);
      return;
    }
    getOptions();
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

  const fields = [
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
        {options.map(option => (
          <Card
            type={CARD_TYPE_ENUM.EVENT_PAYMENT_OPTION}
            items={{ fields, option, onDelete }}
          />
        ))}
        <Card
          items={{ fields, onAdd }}
          type={CARD_TYPE_ENUM.ADD_PAYMENT_OPTION}
        />
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
