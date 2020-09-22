// YourComponent.stories.js

import React from 'react';
import MultiSelect from './index';
import { SIZES_ENUM } from '../../../../../common/enums';

// This default export determines where you story goes in the story list
export default {
  title: 'MultiSelect',
  component: MultiSelect,
};

const Template = args => <MultiSelect {...args} />;

const options = Object.keys(SIZES_ENUM);

export const Empty = Template.bind({});
Empty.args = {
  label: 'MultiSelect',
  options,
  values: [],
};

export const WithValues = Template.bind({});
WithValues.args = {
  label: 'MultiSelect',
  options,
  values: [
    SIZES_ENUM.L,
    SIZES_ENUM.M,
    SIZES_ENUM.SM,
    SIZES_ENUM.XXXS,
  ],
};
