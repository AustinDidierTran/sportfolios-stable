// YourComponent.stories.js

import React from 'react';
import FormDialog from './index';
import { COMPONENT_TYPE_ENUM } from '../../../../../common/enums';

const one = [
  {
    name: 'One',
    color: 'primary',
  },
];
const two = [
  {
    name: 'One',
    color: 'primary',
  },
  {
    name: 'Two',
    color: 'secondary',
  },
];
const select = [
  {
    componentType: COMPONENT_TYPE_ENUM.SELECT,
    label: 'select',
    namespace: 'select',
    options: [
      { value: '1', display: 'one' },
      { value: '2', display: 'two' },
      { value: '3', display: 'three' },
    ],
  },
];
const text = [
  {
    id: 'text',
    namespace: 'text',
    type: 'text',
    label: 'text',
  },
];
const number = [
  {
    namespace: 'number',
    type: 'number',
    label: 'number',
  },
];
const time = [
  {
    id: 'time',
    namespace: 'time',
    type: 'time',
  },
];
const date = [
  {
    id: 'date',
    namespace: 'date',
    type: 'date',
  },
];

// This default export determines where you story goes in the story list
export default {
  title: 'FormDialog',
  component: FormDialog,
  argTypes: {
    buttons: {
      control: {
        type: 'inline-radio',
        options: { one, two },
      },
    },
    fields: {
      control: {
        type: 'inline-radio',
        options: { select, text, number, time, date },
      },
    },
  },
};

const Template = args => <FormDialog {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  open: true,
  title: 'Title',
  description: 'Description',
  buttons: [],
  fields: [],
  formik: {},
};
