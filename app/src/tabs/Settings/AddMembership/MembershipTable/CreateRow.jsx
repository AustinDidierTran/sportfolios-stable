import React from 'react';

import { useFormInput } from '../../../../../src/hooks/forms';
import { TableRow, TableCell } from '../../../../components/MUI';

import IconButton from '../../../../components/Custom/IconButton';

// Buttons
import CellRenderer from './CellRenderer';

import { useTranslation } from 'react-i18next';

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
        const days = [31, 28, 31, 30, 31, 30, 31, 30, 31, 31, 30, 31];
        const date = values[h.value].value.split('/');
        const month = Number(date[0]);
        const day = Number(date[1]);
        if (
          month < 1 ||
          month > 12 ||
          isNaN(month) ||
          month === null
        ) {
          values[h.value].setError(t('invalid_input'));
          isValid = false;
        } else if (
          day > days[month - 1] ||
          day < 1 ||
          isNaN(day) ||
          day === null
        ) {
          values[h.value].setError(t('invalid_input'));
          isValid = false;
        } else {
          values[h.value].setError(null);
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
