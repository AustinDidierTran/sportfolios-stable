import React, { useState } from 'react';

import { useFormInput } from '../../../../hooks/forms';
import { TableRow, TableCell, TextField, IconButton } from '../../../MUI';

// Buttons
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import CellRenderer from './CellRenderer';

export default function CreateRow(props) {
  const { allowCreate, headers, onCreate, validationSchema } = props;
  const [validationErrors, setValidationErrors] = useState({});

  const values = headers.reduce((prev, h) => ({
    ...prev,
    [h.value]: useFormInput('')
  }), {})

  const validateValues = async (v) => {
    if (!validationSchema) {
      return true;
    }

    let isValid = true;

    try {
      const validatedValues = await validationSchema.validate(v);

      return { isValid, validatedValues };
    } catch (err) {
      isValid = false;
      return { isValid, errors: { [err.path]: err.errors[0] } }
    }
  }

  const formatValues = () => {
    const keys = Object.keys(values);

    const formattedValues = keys.reduce((prev, key) => ({
      ...prev,
      [key]: values[key].value
    }), {})

    return validationSchema.cast(formattedValues);
  }

  const onSubmit = async () => {
    const formattedValues = formatValues();

    const { isValid, errors, validatedValues } = await validateValues(formattedValues)

    if (!isValid) {
      setValidationErrors(errors);
    } else {
      setValidationErrors({});
      onCreate(validatedValues);
    }
  }

  return (
    allowCreate ?
      <TableRow>
        {headers.map((h, index) =>
          <CellRenderer
            error={validationErrors[h.value]}
            header={h}
            index={index}
            {...values[h.value]}
          />
        )}
        <TableCell>
          <IconButton size="small" onClick={onSubmit}>
            <Add size="small" />
          </IconButton>
          <IconButton size="small">
            <Delete size="small" />
          </IconButton>
        </TableCell>
      </TableRow>
      : <></>
  )
}