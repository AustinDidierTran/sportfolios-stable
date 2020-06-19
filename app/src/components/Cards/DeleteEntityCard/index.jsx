import React from 'react';

import { Paper, Button } from '../../Custom';
import { TextField } from '../../MUI';
import { useFormInput } from '../../../hooks/forms';

export default function DeleteEntityCard(props) {
  const { id, name, type, ...otherProps } = props;

  const validator = useFormInput('');

  const handleClick = () => {
    const isValidated = validator.value === name;

    if (!isValidated) {
      validator.setError(`To delete, enter ${name}`);
    } else {
    }
  };

  return (
    <Paper title="DeleteEntityCard" {...otherProps}>
      <TextField
        helperText={`To delete, enter ${name}`}
        {...validator.inputProps}
      />
      <Button color="secondary" onClick={handleClick}>
        Delete Entity
      </Button>
    </Paper>
  );
}
