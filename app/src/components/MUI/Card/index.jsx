import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

// See native documentation here: https://material-ui.com/components/cards/

const useStyles = makeStyles({
  card: {
    width: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function CustomCard(props) {
  const classes = useStyles();

  const defaultProps = {
    variant: 'contained',
  };

  return (
    <Card className={classes.card} {...defaultProps} {...props} />
  );
}
