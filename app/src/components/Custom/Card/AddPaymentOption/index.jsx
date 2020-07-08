import React from 'react';

import { useFormInput } from '../../../../hooks/forms';
import { Input, Paper, Button } from '../../../Custom';
import { List, ListItem } from '../../../MUI';
import { useTranslation } from 'react-i18next';

export default function AddPaymentOption(props) {
  const { fields, onAdd } = props;
  const { t } = useTranslation();

  const values = fields.reduce(
    (prev, f) => [...prev, useFormInput(f.initialValue || '')],
    [],
  );

  const onReset = () => {
    Object.keys(values).forEach(key => values[key].reset());
  };

  const validate = () => {
    let isValid = true;
    const price = values[1].value * 100;
    const startDate = values[2].value;
    const endDate = values[3].value;
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

    if (startDate > endDate) {
      values[2].setError(t(''));
      isValid = false;
    }
    return isValid;
  };

  const handleAdd = async () => {
    const isValid = validate();

    if (isValid) {
      await onAdd(values);
      onReset();
    }
  };

  return (
    <Paper>
      <List>
        {fields.map(f => (
          <ListItem>
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
    </Paper>
  );
}
