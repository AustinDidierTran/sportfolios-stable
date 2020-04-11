import React, { useState } from 'react';

export const useFormInput = initialValue => {
  const [defaultValue, setDefaultValue] = useState(initialValue);
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    console.log('e.target.value', e.target.value);

    setValue(e.target.value);
  };

  const changeDefault = newDefault => {
    if (newDefault !== defaultValue) {
      setDefaultValue(newDefault);
      setValue(newDefault);
    }
  };

  const setCurrentAsDefault = () => setDefaultValue(value);

  const reset = () => setValue(defaultValue);

  const inputProps = {
    value,
    onChange: handleChange,
  };

  return {
    ...inputProps,
    reset,
    changeDefault,
    inputProps,
    setCurrentAsDefault,
  };
};
