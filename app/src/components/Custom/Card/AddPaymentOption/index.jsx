import React, { useState } from 'react';

import { useFormInput } from '../../../../hooks/forms';
import { Input, Paper, Button } from '../../../Custom';
import { List, ListItem } from '../../../MUI';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import api from '../../../../actions/api';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AddPaymentOption(props) {
  const { fields, onAdd: onAddProps } = props;
  const { t } = useTranslation();
  const { id: eventId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState('');

  const values = fields.reduce(
    (prev, f) => [...prev, useFormInput(f.initialValue || '')],
    [],
  );
  const onReset = () => {
    Object.keys(values).forEach(key => values[key].reset());
  };

  const validate = () => {
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
      }
    });

    if (start >= end) {
      setDisplay(t('registration_closes_before_opening'));
      setOpen(true);
      setIsLoading(false);
      isValid = false;
    }
    return isValid;
  };

  const onAdd = async values => {
    setIsLoading(true);
    const name = values[0].value;
    const price = Number(values[1].value) * 100;
    const startDate = values[2].value;
    const startTime = values[3].value;
    const endDate = values[4].value;
    const endTime = values[5].value;
    const start = `${startDate} ${startTime}`;
    const end = `${endDate} ${endTime}`;

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

    onAddProps(res.status);
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
    return (
      <Paper>
        <CircularProgress />
      </Paper>
    );
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
        >
          {t('add')}
        </Button>
      </List>
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
    </Paper>
  );
}
