import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function RosterChips(props) {
  const classes = useStyles();

  const { state } = props;

  return (
    <div className={classes.root}>
      {state ? (
        <Chip
          label="Conforme"
          variant="outlined"
          icon={<FaceIcon />}
          color="primary"
        />
      ) : (
        <Chip
          label="Non-Conforme"
          variant="outlined"
          icon={<FaceIcon />}
          color="secondary"
        />
      )}
    </div>
  );
}
