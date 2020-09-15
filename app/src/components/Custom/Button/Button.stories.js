// YourComponent.stories.js

import React from 'react';
import Button from './index';

// This default export determines where you story goes in the story list
export default {
  title: 'Button',
  component: Button,
  argTypes: {
    size: {
      control: {
        type: 'inline-radio',
        options: ['small', 'medium', 'large'],
      },
    },
    color: {
      control: {
        type: 'inline-radio',
        options: ['primary', 'secondary'],
      },
    },
    endIcon: {
      control: {
        type: 'inline-radio',
        options: [null, 'Check', 'Close'],
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

const Template = args => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'Button',
  color: 'primary',
  size: 'small',
  endIcon: null,
  variant: 'contained',
};
