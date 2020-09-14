// YourComponent.stories.js

import React from 'react';
import Dialog from './index';

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
const three = [
  {
    name: 'One',
    color: 'primary',
  },
  {
    name: 'Two',
    color: 'secondary',
  },
  {
    name: 'Three',
    color: 'primary',
  },
];

// This default export determines where you story goes in the story list
export default {
  title: 'Dialog',
  component: Dialog,
  argTypes: {
    buttons: {
      control: {
        type: 'inline-radio',
        options: { one, two, three },
      },
    },
  },
};

const Template = args => <Dialog {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  open: true,
  title: 'Title',
  description: 'Description',
  buttons: one,
};
