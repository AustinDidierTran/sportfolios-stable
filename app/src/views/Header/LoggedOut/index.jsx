import React from 'react';
import { Link } from 'react-router-dom';

import { fade, makeStyles } from '@material-ui/core/styles';

import { AppBar, Toolbar, Typography } from '../../../components/MUI';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'block',
    width: '100%',
  },
  titleLink: {
    color: 'white',
    textDecoration: 'none',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function LoggedOut() {
  const classes = useStyles();

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            className={classes.title}
            style={{ fontSize: '1.5rem' }}
            variant="h6"
            noWrap
          >
            <Link to={'/'} className={classes.titleLink}>
              {' '}
              Sportfolios
            </Link>
          </Typography>
          <div className={classes.search}></div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}></div>
          <div className={classes.sectionMobile}></div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
