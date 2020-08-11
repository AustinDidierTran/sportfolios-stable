import React, { useState, useContext, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Store } from '../../../Store';
import { POSITION_ENUM } from '../../../../../common/enums';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SnackBar() {
  const {
    state: {
      message,
      severity,
      duration,
      horizontal,
      vertical,
      time,
    },
  } = useContext(Store);

  const [open, setOpen] = useState(false);
  const [vert, setVert] = useState(POSITION_ENUM.BOTTOM);
  const [horz, setHorz] = useState(POSITION_ENUM.CENTER);

  useEffect(() => {
    if (message || severity) {
      setOpen(true);
    }
    setVert(vertical || POSITION_ENUM.BOTTOM);
    setHorz(horizontal || POSITION_ENUM.CENTER);
  }, [message, severity, time]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setVert(POSITION_ENUM.BOTTOM);
      setHorz(POSITION_ENUM.CENTER);
    }, 1000);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: vert, horizontal: horz }}
      autoHideDuration={duration || 5000}
      onClose={handleClose}
    >
      <Alert onClose={() => setOpen(false)} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}
