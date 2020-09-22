// YourComponent.stories.js

import React from 'react';
import AutoComplete from './index';

// This default export determines where you story goes in the story list
export default {
  title: 'AutoComplete',
  component: AutoComplete,
  argTypes: {
    icon: {
      control: {
        type: 'inline-radio',
        options: [null, 'Home', 'Search'],
      },
    },
    namespace: {
      control: {
        type: 'inline-radio',
        options: [null, 'Namespace'],
      },
    },
  },
};

const Template = args => <AutoComplete {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  icon: null,
  namespace: null,
};
