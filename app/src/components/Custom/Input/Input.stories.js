// YourComponent.stories.js

import React from 'react';
import Input from './index';

// This default export determines where you story goes in the story list
export default {
  title: 'Input',
  component: Input,
};

const Template = args => <Input {...args} />;

export const Text = Template.bind({});
Text.args = {
  type: 'text',
};
export const File = Template.bind({});
File.args = {
  type: 'file',
};
export const Number = Template.bind({});
Number.args = {
  type: 'number',
};
export const Date = Template.bind({});
Date.args = {
  type: 'date',
};
export const Time = Template.bind({});
Time.args = {
  type: 'time',
};
