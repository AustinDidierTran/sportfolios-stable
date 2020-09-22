// YourComponent.stories.js

import React from 'react';
import IconButton from './index';

// This default export determines where you story goes in the story list
export default {
  title: 'IconButton',
  component: IconButton,
  argTypes: {
    size: {
      control: {
        type: 'inline-radio',
        options: ['small', 'medium'],
      },
    },
    fontSize: {
      control: {
        type: 'inline-radio',
        options: ['small', 'default', 'large'],
      },
    },
    icon: {
      control: {
        type: 'inline-radio',
        options: ['Add', 'Home', 'Close'],
      },
    },
    color: {
      control: {
        type: 'inline-radio',
        options: ['primary', 'secondary', 'grey'],
      },
    },
  },
};

const Template = args => <IconButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  size: 'medium',
  fontSize: 'default',
  tooltip: 'title',
  icon: 'Add',
  color: 'primary',
};
