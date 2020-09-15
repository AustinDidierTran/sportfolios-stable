// YourComponent.stories.js

import React from 'react';
import Avatar from './index';

// This default export determines where you story goes in the story list
export default {
  title: 'Avatar',
  component: Avatar,
  argTypes: {
    size: {
      control: {
        type: 'inline-radio',
        options: ['sm', 'md', 'lg'],
      },
    },
    variant: {
      control: {
        type: 'inline-radio',
        options: ['circle', 'square'],
      },
    },
    initials: {
      control: {
        type: 'inline-radio',
        options: [null, 'SF'],
      },
    },
  },
};

const Template = args => <Avatar {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  size: 'md',
  variant: 'circle',
  initials: null,
};
