import React, { useRef } from 'react';

import { TextField } from '../../MUI';

export default function CustomFileInput(props) {
  const { onChange } = props;
  const inputEl = useRef(null);

  return (
    <TextField
      inputRef={inputEl}
      type="file"
      {...props}
      onChange={() => onChange(inputEl.current.files)}
    />
  );
}
