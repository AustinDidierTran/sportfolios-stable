import React, { useState } from 'react';
import moment from 'moment';
import { TextField } from '../../MUI';

// TODO: Update this input so it has 3 fields for day, month and year
export default function CustomDateInput(props) {
  const { error, value } = { ...props };

  const [inputError, setInputError] = useState();

  const validateInput = () => {
    var date = moment(value);
    var pattern = /^(\d{4})(\-)(\d{1,2})(\-)(\d{1,2})$/;
    var match = value.match(pattern);
    var year = match[1];

    date.isValid() && year > 1900 && year < 10000
      ? setInputError()
      : setInputError('Invalid Format');
  };

  return (
    <>
      <TextField
        error={error || inputError}
        type="date"
        placeholder="yyyy-mm-dd"
        inputProps={{
          onBlur() {
            validateInput();
          },
        }}
        {...props}
      />
    </>
  );
}
