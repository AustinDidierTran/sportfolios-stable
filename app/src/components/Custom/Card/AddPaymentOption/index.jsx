import React, { useState, useContext } from 'react';

import { useFormInput } from '../../../../hooks/forms';
import { Input, Paper, Button } from '../../../Custom';
import { List, ListItem } from '../../../MUI';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { Store, ACTION_ENUM } from '../../../../Store';
import styles from './AddPaymentOption.module.css';
import LoadingSpinner from '../../LoadingSpinner';
import { SEVERITY_ENUM } from '../../../../../../common/enums';

export default function AddPaymentOption(props) {
  const { fields, onAdd: onAddProps, hasBankAccount } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { id: eventId } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const values = fields.reduce(
    (prev, f) => [...prev, useFormInput(f.initialValue || '')],
    [],
  );
  const onReset = () => {
    Object.keys(values).forEach(key => values[key].reset());
  };

  const validate = () => {
    setIsLoading(true);

    let isValid = true;
    const price = Number(values[1].value) * 100;
    const startDate = values[2].value;
    const startTime = values[3].value;
    const endDate = values[4].value;
    const endTime = values[5].value;

    const start = moment(`${startDate} ${startTime}`);
    const end = moment(`${endDate} ${endTime}`);
    Object.keys(values).forEach(key => {
      if (values[key].value === '' || values[key].value === null) {
        values[key].setError(t('value_is_required'));
        isValid = false;
      } else {
        values[key].setError(null);
      }
    });

    fields.map(f => {
      if (f.display === t('price')) {
        if (price.value < 0) {
          values[f.value].setError(t('invalid_input'));
          isValid = false;
        }
        if (!hasBankAccount) {
          if (price > 0) {
            values[f.value].setError(t('no_bank_account_linked'));
            dispatch({
              type: ACTION_ENUM.SNACK_BAR,
              message: t('no_bank_account_linked'),
              severity: SEVERITY_ENUM.ERROR,
            });
            isValid = false;
          }
        }
      }
    });
    if (start.isAfter(end)) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('registration_closes_before_opening'),
        severity: SEVERITY_ENUM.ERROR,
      });
      isValid = false;
    }
    setIsLoading(false);
    return isValid;
  };

  const onAdd = async values => {
    setIsLoading(true);
    const name = values[0].value;
    const price = Math.floor(Number(values[1].value) * 100);
    const startDate = values[2].value;
    const startTime = values[3].value;
    const endDate = values[4].value;
    const endTime = values[5].value;
    const start = new Date(`${startDate} ${startTime}`).getTime();
    const end = new Date(`${endDate} ${endTime}`).getTime();

    const res = await api(`/api/entity/option`, {
      method: 'POST',
      body: JSON.stringify({
        eventId,
        name,
        price,
        endTime: end,
        startTime: start,
      }),
    });
    if (res.status === 400) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('payment_option_exist'),
        severity: SEVERITY_ENUM.ERROR,
      });
      setIsLoading(false);
      return;
    }
    onAddProps();
    setIsLoading(false);
  };

  const handleAdd = async () => {
    const isValid = validate();

    if (isValid) {
      await onAdd(values);
      onReset();
    }
  };

  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }
  return (
    <Paper>
      <List>
        {fields.map(f => (
          <ListItem
            style={{ paddingTop: '8px', paddingBottom: '0px' }}
          >
            <Input
              helperText={f.helperText}
              label={f.display}
              namespace={f.value}
              type={f.type}
              {...values[f.value]}
            />
          </ListItem>
        ))}
        <Button
          size="small"
          variant="contained"
          endIcon="Add"
          style={{ margin: '8px' }}
          onClick={handleAdd}
          className={styles.button}
        >
          {t('add')}
        </Button>
      </List>
    </Paper>
  );
}
