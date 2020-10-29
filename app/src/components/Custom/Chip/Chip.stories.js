// YourComponent.stories.js

import React from 'react';
import Chip from './index';

// This default export determines where you story goes in the story list
export default {
  title: 'Chip',
  component: Chip,
  argTypes: {
    color: {
      control: {
        type: 'inline-radio',
        options: ['primary', 'secondary', 'grey'],
      },
    },
    variant: {
      control: {
        type: 'inline-radio',
        options: ['contained', 'outlined', 'text'],
      },
    },
  },
};

const Template = args => <Chip {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'Chip',
  color: 'primary',
  variant: 'contained',
};
