import React from 'react';
import { TextField } from '../../MUI';
import { Select, MultiSelect } from '../../Custom';
import { COMPONENT_TYPE_ENUM } from '../../../../../common/enums';

export default function ComponentFactory(props) {
  const { component } = props;
  if (component.componentType === COMPONENT_TYPE_ENUM.SELECT) {
    return (
      <Select
        options={component.options}
        formik={component.formik}
        namespace={component.namespace}
        label={component.label}
        defaultValue={component.defaultValue}
        style={component.style}
      />
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.MULTISELECT) {
    return (
      <MultiSelect
        formik={component.formik}
        label={component.label}
        options={component.options}
        values={component.values}
        onChange={component.onChange}
        style={component.style}
      />
    );
  }
  return (
    <TextField
      formik={component.formik}
      namespace={component.namespace}
      id={component.id}
      label={component.label}
      type={component.type}
      defaultValue={component.defaultValue}
      disabled={component.disabled}
      color={component.color}
      variant={component.variant}
      fullWidth
      style={component.style}
    />
  );
}
