import React, { useEffect } from 'react';

import { useFormInput } from '../../../../hooks/forms';
import { Input, Paper, Button } from '../../../Custom';
import { List, ListItem } from '../../../MUI';
import { useTranslation } from 'react-i18next';
import styles from './EventSettings.module.css';

export default function EventSettings(props) {
  const { fields, onSave } = props;
  const { t } = useTranslation();

  const values = fields.reduce(
    (prev, f) => [...prev, useFormInput(f.initialValue)],
    [],
  );

  useEffect(() => {
    fields.forEach((f, index) => {
      values[index].changeDefault(f.initialValue);
    });
  }, [fields]);

  const onReset = () => {
    Object.keys(values).forEach(key => values[key].reset());
  };

  const handleSave = async () => {
    let isValid = true;
    const start_date = values[1].value;
    const end_date = values[2].value;
    Object.keys(values).forEach(key => {
      if (values[key].value === '' || values[key].value === null) {
        values[key].setError(t('value_is_required'));
        isValid = false;
      } else {
        values[key].setError(null);
      }
    });

    fields.map((f, index) => {
      if (f.display === t('maximum_spots')) {
        if (values[index].value < 0) {
          values[index].setError(t('invalid_input'));
          isValid = false;
        }
      }
    });

    if (isValid) {
      await onSave(values);
      if (start_date < end_date) {
        onReset();
      }
    }
  };

  return (
    <Paper className={styles.paper}>
      <List>
        {fields.map((f, index) => (
          <ListItem key={index}>
            <Input
              fullWidth
              helperText={f.helperText}
              label={f.display}
              type={f.type}
              {...values[index]}
            />
          </ListItem>
        ))}
        <Button
          size="small"
          variant="contained"
          endIcon="Check"
          style={{ marginTop: '8px' }}
          onClick={handleSave}
        >
          {t('save')}
        </Button>
      </List>
    </Paper>
  );
}
