// YourComponent.stories.js

import React from 'react';
import AlertDialog from './index';

// This default export determines where you story goes in the story list
export default {
  title: 'AlertDialog',
  component: AlertDialog,
};

const Template = args => <AlertDialog {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  open: true,
  title: 'Title',
  description: 'Description',
};
