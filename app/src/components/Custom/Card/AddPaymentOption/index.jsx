import React from 'react';

import { useFormInput } from '../../../../hooks/forms';
import { Input, Paper, Button } from '../../../Custom';
import { List, ListItem } from '../../../MUI';
import { useTranslation } from 'react-i18next';

export default function AddPaymentOption(props) {
  const { fields, onAdd } = props;
  const { t } = useTranslation();

  const values = fields.reduce(
    (prev, f) => ({
      ...prev,
      [f.value]: useFormInput(f.initialValue || ''),
    }),
    {},
  );

  const onReset = () => {
    Object.keys(values).forEach(key => values[key].reset());
  };

  const handleAdd = async () => {
    let isValid = true;
    const start_date = values[2].value;
    const end_date = values[3].value;
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
        if (values[f.value].value < 0) {
          values[f.value].setError(t('invalid_input'));
          isValid = false;
        }
      }
    });

    if (isValid) {
      await onAdd(values);
      if (start_date < end_date) {
        onReset();
      }
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
