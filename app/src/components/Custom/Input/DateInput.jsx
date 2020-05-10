import React, { useState } from 'react';
import moment from 'moment';
import { TextField } from '../../MUI';
import { useTranslation } from 'react-i18next';

export default function CustomDateInput(props) {
  const { error, value } = { ...props };
  const { t } = useTranslation();

  const [inputError, setInputError] = useState();

  const validateInput = () => {
    var date = moment(value);
    var pattern = /^(\d{4})(\-)(\d{1,2})(\-)(\d{1,2})$/;
    var match = value.match(pattern);
    var year = match[1];

    date.isValid() && year > 1900 && year <= moment().year()
      ? setInputError()
      : setInputError(t('invalid_date'));
  };

  return (
    <>
      <TextField
        error={error || inputError}
        type="date"
        placeholder="yyyy-mm-dd"
        inputProps={{
          onBlur: () => {
            validateInput();
          },
        }}
        {...props}
      />
    </>
  );
}
