import React, { useState } from 'react';

import { useFormInput } from '../../../../hooks/forms';
import { TableRow, TableCell } from '../../../MUI';

import IconButton from '../../IconButton';

// Buttons
import CellRenderer from './CellRenderer';

export default function CreateRow(props) {
  const { allowCreate, headers, onCreate, validationSchema } = props;
  const [validationErrors, setValidationErrors] = useState({});

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

  const validateValues = async v => {
    if (!validationSchema) {
      return true;
    }

    let isValid = true;

    try {
      const validatedValues = await validationSchema.validate(v);

      return { isValid, validatedValues };
    } catch (err) {
      isValid = false;
      return { isValid, errors: { [err.path]: err.errors[0] } };
    }
  };

  const flattenValues = () => {
    const keys = Object.keys(values);

    const flattenedValues = keys.reduce(
      (prev, key) => ({
        ...prev,
        [key]: values[key].value,
      }),
      {},
    );

    return validationSchema.cast(flattenedValues);
  };

  const onSave = async () => {
    const formattedValues = flattenValues();

    const { isValid, errors, validatedValues } = await validateValues(
      formattedValues,
    );

    if (!isValid) {
      setValidationErrors(errors);
    } else {
      setValidationErrors({});
      onReset();
      onCreate(validatedValues);
    }
  };

  return allowCreate ? (
    <TableRow>
      {headers.map((h, index) => (
        <CellRenderer
          error={validationErrors[h.value]}
          header={h}
          key={index}
          index={index}
          {...values[h.value]}
        />
      ))}
      <TableCell>
        <IconButton size="small" onClick={onSave} icon="Add" />
        <IconButton size="small" onClick={onReset} icon="Delete" />
      </TableCell>
    </TableRow>
  ) : (
    <></>
  );
}
