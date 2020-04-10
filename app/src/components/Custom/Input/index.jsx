import React from 'react';

import { TextField } from '../../MUI';

export default function CustomInput(props) {
  const { type, ...inputProps } = props;

  switch (type) {
    case 'date':
      return <TextField {...props} />;
    case 'number':
      return <TextField type="number" {...inputProps} />;
    default:
      return <TextField {...props} />;
  }
}
