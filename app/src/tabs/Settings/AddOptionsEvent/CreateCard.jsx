import React from 'react';

import { useFormInput } from '../../../hooks/forms';
import { Input, Paper } from '../../../components/Custom';
import { List, ListItem } from '../../../components/MUI';

import { Button } from '../../../components/Custom';

// Buttons
import { useTranslation } from 'react-i18next';

export default function CreateCard(props) {
  const { headers, onAdd } = props;
  const { t } = useTranslation();

  const values = headers.reduce(
    (prev, h) => ({
      ...prev,
      [h.value]: useFormInput(h.initialValue || ''),
    }),
    {},
  );

  const onReset = () => {
    Object.keys(values).forEach(key => values[key].reset());
  };

  const handleAdd = async () => {
    let isValid = true;
    Object.keys(values).forEach(key => {
      if (values[key].value === '' || values[key].value === null) {
        values[key].setError(t('value_is_required'));
        isValid = false;
      } else {
        values[key].setError(null);
      }
    });

    headers.map(h => {
      if (h.display === t('price')) {
        if (values[h.value].value < 0) {
          values[h.value].setError(t('invalid_input'));
          isValid = false;
        }
      }
    });

    if (isValid) {
      await onAdd(values);
      if (values[2].value < values[3].value) {
        onReset();
      }
    }
  };

  return (
    <Paper>
      <List>
        {headers.map(h => (
          <ListItem>
            <Input
              helperText={h.helperText}
              label={h.display}
              namespace={h.value}
              type={h.type}
              disabled={h.disabled}
              {...values[h.value]}
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
