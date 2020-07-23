import { useState, useMemo } from 'react';

export const useFormInput = initialValue => {
  const [defaultValue, setDefaultValue] = useState(initialValue);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    if (e.target) {
      setValue(e.target.value);
    } else {
      setValue(e);
    }
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
    setValue,
  };
};

export const useStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(new Set());

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleCompleted = step => {
    setCompleted(prevCompleted => {
      const newCompleted = new Set(prevCompleted.values());
      newCompleted.add(step);
      return newCompleted;
    });
  };

  const handleNotCompleted = step => {
    setCompleted(prevCompleted => {
      const newCompleted = new Set(prevCompleted.values());
      newCompleted.delete(step);
      return newCompleted;
    });
  };

  return {
    stepperProps: {
      activeStep,
      completed,
      handleBack,
      handleNext,
    },
    handleBack,
    handleCompleted,
    handleNext,
    handleNotCompleted,
    handleReset,
  };
};
