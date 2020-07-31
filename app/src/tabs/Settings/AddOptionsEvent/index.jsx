import React, { useEffect, useState } from 'react';

import { Paper, Card } from '../../../components/Custom';
import { Container, Typography } from '../../../components/MUI';

import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { useParams } from 'react-router-dom';

import styles from './AddOptionsEvent.module.css';
import { CARD_TYPE_ENUM } from '../../../../../common/enums';
import moment from 'moment';

export default function AddOptionsEvent() {
  const { t } = useTranslation();

  const { id: eventId } = useParams();

  const [options, setOptions] = useState([]);
  const [hasBankAccount, setHasBankAccount] = useState(false);

  useEffect(() => {
    getOptions();
  }, [eventId]);

  useEffect(() => {
    getHasBankAccount();
  }, [eventId]);

  const getOptions = async () => {
    const { data } = await api(
      formatRoute('/api/entity/options', null, { eventId }),
    );
    const dataOptions = data.map(d => Object.values(d));
    setOptions(dataOptions);
  };

  const onAdd = () => {
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

  const getHasBankAccount = async () => {
    const res = await api(
      formatRoute('/api/stripe/eventHasBankAccount', null, {
        id: eventId,
      }),
    );
    setHasBankAccount(res.data);
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
      helperText: t('registration_open_date'),
      type: 'date',
      value: 2,
      initialValue: moment().format('YYYY-MM-DD'),
    },
    {
      helperText: t('registration_open_time'),
      type: 'time',
      value: 3,
      initialValue: '00:00',
    },
    {
      helperText: t('registration_close_date'),
      type: 'date',
      value: 4,
    },
    {
      helperText: t('registration_close_time'),
      type: 'time',
      value: 5,
      initialValue: '23:59',
    },
  ];

  if (!hasBankAccount) {
    return (
      <Paper title={t('add_payment_options')}>
        <Container>
          <Typography>{t('admin_has_no_bank_account')}</Typography>
        </Container>
      </Paper>
    );
  }

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
      </Container>
    </Paper>
  );
}
