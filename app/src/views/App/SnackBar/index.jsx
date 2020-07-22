import React, { useState, useContext, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Store } from '../../../Store';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SnackBar() {
  const {
    state: { message, severity, time },
  } = useContext(Store);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (message || severity) {
      setOpen(true);
    }
  }, [message, severity, time]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => setOpen(false)}
    >
      <Alert onClose={() => setOpen(false)} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}
