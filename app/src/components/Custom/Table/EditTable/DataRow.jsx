import React, { useState } from 'react';

import { TableRow, TableCell, IconButton } from '../../../MUI';
import CellRenderer from './CellRenderer';

import { useFormInput } from '../../../../hooks/forms';

// Buttons
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import { Tooltip } from '@material-ui/core';
import { useEffect } from 'react';

export default function DataRow(props) {
  const { datum, headers, onEdit, validationSchema } = props;
  const [isEditMode, setEditMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});


  let values = headers.reduce((prev, h) => ({
    ...prev,
    [h.value]: useFormInput(datum[h.value] || '')
  }), {});


  const resetValues = () => {
    Object.keys(values).forEach((key) => values[key].reset());
  }

  useEffect(() => {
    console.log('datum', datum);

    Object.keys(values).forEach(key => values[key].changeDefault(datum[key]));

  }, [datum])

  const flattenValues = () => {
    const keys = Object.keys(values);

    const flattenedValues = keys.reduce((prev, key) => ({
      ...prev,
      [key]: values[key].value
    }), {})

    return validationSchema.cast(flattenedValues);
  }

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

  const onCancel = () => {
    resetValues();
    setEditMode(false);
  }

  const onDelete = () => {
    // Deleting...
  }

  const onEditMode = () => {
    setEditMode(true);
  }

  const onSave = async () => {
    // Saving...
    const formattedValues = flattenValues();

    const { isValid, errors, validatedValues } = await validateValues(formattedValues);

    if (!isValid) {
      setValidationErrors(errors);
    } else {
      setValidationErrors({});
      resetValues();
      onEdit(datum.id, validatedValues);
      setEditMode(false);
    }
  }

  return isEditMode ?
    <TableRow>
      {headers.map((h, index) =>
        h.isEditable !== false ? <CellRenderer
          header={h}
          index={index}
          error={validationErrors[h.value]}
          {...values[h.value]}
        /> : <TableCell key={index}>{datum[h.value]}</TableCell>
      )}
      <TableCell>
        <Tooltip title="Save">
          <IconButton size="small" onClick={onSave}>
            <Check size="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cancel">
          <IconButton size="small" onClick={onCancel}>
            <Close size="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
    :
    <TableRow>
      {headers.map((h, index) => <TableCell key={index}>{datum[h.value]}</TableCell>)}
      <TableCell>
        <Tooltip title="Edit">
          <IconButton size="small" onClick={onEditMode}>
            <Edit size="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" onClick={onDelete}>
            <Delete size="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
}