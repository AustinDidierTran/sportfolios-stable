import React from 'react';

import { useFormInput } from '../../../../../src/hooks/forms';
import { TableRow, TableCell } from '../../../../components/MUI';

import IconButton from '../../../../components/Custom/IconButton';

// Buttons
import CellRenderer from './CellRenderer';
import { useTranslation } from 'react-i18next';
import { validateDate } from '../../../../utils/stringFormats';

export default function CreateRow(props) {
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

      if (h.display === 'MM/DD') {
        if (validateDate(values[h.value].value)) {
          values[h.value].setError(null);
        } else {
          values[h.value].setError(t('invalid_input'));
          isValid = false;
        }
      }
    });

    if (isValid) {
      await onAdd(values);
      onReset();
    }
  };

  return (
    <TableRow>
      {headers.map((h, index) => (
        <CellRenderer
          header={h}
          key={index}
          index={index}
          {...values[h.value]}
        />
      ))}
      <TableCell>
        <IconButton size="small" onClick={handleAdd} icon="Add" />
      </TableCell>
    </TableRow>
  );
}
