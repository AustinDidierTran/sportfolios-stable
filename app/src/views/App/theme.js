import { createMuiTheme } from '@material-ui/core/styles';

import teal from '@material-ui/core/colors/teal';

const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    primary: teal,
  },
});

theme.typography.h3 = {
  fontFamily: 'Helvetica',
  fontWeight: 350,
  fontSize: '1.4rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.8rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.4rem',
  },
};

theme.typography.h4 = {
  fontFamily: 'Helvetica',
  fontWeight: 350,
  fontSize: '1.2rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.6rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.1rem',
  },
};

theme.typography.h5 = {
  fontFamily: 'Helvetica',
  fontWeight: 350,
  fontSize: '1rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.4rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.8rem',
  },
};

theme.typography.h6 = {
  fontFamily: 'Helvetica',
  fontWeight: 350,
  fontSize: '0.8rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.2rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.5rem',
  },
};

theme.typography.h7 = {
  fontFamily: 'Helvetica',
  fontWeight: 350,
  fontSize: '0.6rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.0rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.2rem',
  },
};

export default theme;
