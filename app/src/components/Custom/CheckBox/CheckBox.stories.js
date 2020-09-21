// YourComponent.stories.js

import React from 'react';
import { CheckBox } from './index';

// This default export determines where you story goes in the story list
export default {
  title: 'CheckBox',
  component: CheckBox,
  argTypes: {
    color: {
      control: {
        type: 'inline-radio',
        options: ['primary', 'secondary'],
      },
    },
    label: {
      control: {
        type: 'inline-radio',
        options: ['', 'with label'],
      },
    },
  },
};

const Template = args => <CheckBox {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
  label: 'withLabel',
};
