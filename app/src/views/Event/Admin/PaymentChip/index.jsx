import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import AttachMoney from '@material-ui/icons/AttachMoney';

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

export default function PaymentChips(props) {
  const classes = useStyles();

  const { state, mobile } = props;

  return (
    <div className={classes.root}>
      {state > 0 ? (
        <Chip
          label={state}
          icon={<AttachMoney />}
          color="secondary"
        />
      ) : mobile ? (
        <></>
      ) : (
        <Chip label={state} icon={<AttachMoney />} color="primary" />
      )}
    </div>
  );
}
