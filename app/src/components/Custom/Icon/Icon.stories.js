// YourComponent.stories.js

import React from 'react';
import Icon from './index';

// This default export determines where you story goes in the story list
export default {
  title: 'Icon',
  component: Icon,
  argTypes: {
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
        options: ['primary', 'grey'],
      },
    },
  },
};

const Template = args => <Icon {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  fontSize: 'default',
  icon: 'Add',
  color: 'primary',
};
