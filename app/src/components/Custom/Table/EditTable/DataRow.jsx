import React, { useState } from 'react';

import { TableRow, TableCell } from '../../../MUI';
import CellRenderer from './CellRenderer';

import { useFormInput } from '../../../../hooks/forms';

import IconButton from '../../IconButton';

// Buttons
import { useEffect } from 'react';

export default function DataRow(props) {
  const { datum, headers, onEdit, validationSchema } = props;
  const [isEditMode, setEditMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  let values = headers.reduce(
    (prev, h) => ({
      ...prev,
      [h.value]: useFormInput(datum[h.value] || ''),
    }),
    {},
  );

  const resetValues = () => {
    Object.keys(values).forEach(key => values[key].reset());
  };

  useEffect(() => {
    Object.keys(values).forEach(key =>
      values[key].changeDefault(datum[key]),
    );
  }, [datum]);

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

  const onCancel = () => {
    resetValues();
    setEditMode(false);
  };

  const onDelete = () => {
    // Deleting...
  };

  const onEditMode = () => {
    setEditMode(true);
  };

  const onSave = async () => {
    // Saving...
    const formattedValues = flattenValues();

    const { isValid, errors, validatedValues } = await validateValues(
      formattedValues,
    );

    if (!isValid) {
      setValidationErrors(errors);
    } else {
      setValidationErrors({});
      resetValues();
      onEdit(datum.id, validatedValues);
      setEditMode(false);
    }
  };

  return isEditMode ? (
    <TableRow>
      {headers.map((h, index) =>
        h.isEditable !== false ? (
          <CellRenderer
            header={h}
            index={index}
            error={validationErrors[h.value]}
            key={index}
            {...values[h.value]}
          />
        ) : (
          <TableCell key={index}>{datum[h.value]}</TableCell>
        ),
      )}
      <TableCell>
        <IconButton icon="Check" onClick={onSave} tooltip="Save" />
        <IconButton
          icon="Close"
          onClick={onCancel}
          tooltip="Cancel"
        />
      </TableCell>
    </TableRow>
  ) : (
    <TableRow>
      {headers.map((h, index) => (
        <TableCell key={index}>{datum[h.value]}</TableCell>
      ))}
      <TableCell>
        <IconButton icon="Edit" onClick={onEditMode} tooltip="Edit" />
        <IconButton
          icon="Delete"
          onClick={onDelete}
          tooltip="Delete"
        />
      </TableCell>
    </TableRow>
  );
}
