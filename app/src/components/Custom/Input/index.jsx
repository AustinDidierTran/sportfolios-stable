import React from 'react';

import { TextField } from '../../MUI';

import FileInput from './FileInput';

import DateInput from './DateInput';

export default function CustomInput(props) {
  const { type, ...inputProps } = props;

  switch (type) {
    case 'date':
      return <DateInput {...props} />;
    case 'file':
      return <FileInput type="file" {...inputProps} />;
    case 'number':
      return <TextField type="number" {...inputProps} />;
    case 'text':
      return <TextField type="text" {...inputProps} />;
    default:
      return <TextField {...props} />;
  }
}
