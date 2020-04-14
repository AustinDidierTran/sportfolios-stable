import React from 'react';

import { TextField } from '../../MUI';

import FileInput from './FileInput';

export default function CustomInput(props) {
  const { type, ...inputProps } = props;

  switch (type) {
    case 'date':
      return <TextField {...props} />;
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
