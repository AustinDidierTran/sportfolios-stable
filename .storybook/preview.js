import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../app/src/views/App/theme';

export const decorators = [
  Story => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
