import React, { useEffect, useRef } from 'react';

import { TextField } from '../../MUI';

export default function CustomFileInput(props) {
  const { onChange } = props;
  const inputEl = useRef(null);

  console.log('inputEl', inputEl);
  useEffect(() => {
    console.log('inputEl.current', inputEl.current);
  }, [inputEl]);

  useEffect(() => {
    console.log(
      'inputEl.current.files',
      inputEl.current && inputEl.current.files,
    );
  }, [inputEl.current && inputEl.current.files]);

  return (
    <TextField
      inputRef={inputEl}
      type="file"
      {...props}
      onChange={() => onChange(inputEl.current.files)}
    />
  );
}
