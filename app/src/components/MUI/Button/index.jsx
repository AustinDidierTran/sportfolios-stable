import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';

// See native documentation here: https://material-ui.com/components/cards/

const useStyles = makeStyles({
  card: {
    minWidth: 275,
    color: '#fff',
    backgroundColor: '#18B393',
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

export default function CustomButton(props) {
  const classes = useStyles();

  const defaultProps = {
    variant: 'contained',
  };

  return (
    <Button
      className={clsx(props.className, classes.card)}
      {...defaultProps}
      {...props}
    />
  );
}
