import React from 'react';
import { TextField } from '../../MUI';
import { Select, MultiSelect, Button, CheckBox } from '../../Custom';
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
  if (component.componentType === COMPONENT_TYPE_ENUM.BUTTON) {
    return (
      <Button
        children={component.children}
        namespace={component.namespace}
        endIcon={component.endIcon}
        onClick={component.onClick}
        style={component.style}
        variant={component.variant}
        color={component.color}
      />
    );
  }
  if (component.componentType === COMPONENT_TYPE_ENUM.CHECKBOX) {
    return (
      <CheckBox
        checked={component.checked}
        onChange={component.onChange}
        label={component.label}
        namespace={component.namespace}
        color={component.color}
        name={component.name}
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
