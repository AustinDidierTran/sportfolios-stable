import React, { useState, useMemo } from 'react';

export const useFormInput = initialValue => {
  const [defaultValue, setDefaultValue] = useState(initialValue);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  };

  // Public Attributes

  const changeDefault = newDefault => {
    if (newDefault !== defaultValue) {
      setDefaultValue(newDefault);
      setValue(newDefault);
    }
  };

  const hasChanged = useMemo(() => defaultValue !== value, [
    defaultValue,
    value,
  ]);

  const inputProps = {
    error,
    value,
    onChange: handleChange,
  };

  const reset = () => setValue(defaultValue);

  const setCurrentAsDefault = () => setDefaultValue(value);

  return {
    ...inputProps,
    changeDefault,
    hasChanged,
    inputProps,
    reset,
    setCurrentAsDefault,
    setError,
  };
};
