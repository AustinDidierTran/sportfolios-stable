import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useEffect } from 'react';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SnackBar(props) {
  const { message, severity } = props;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (message || severity) {
      setOpen(true);
    }
  }, [message, severity]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Alert
        onClose={() => {
          setOpen(false);
        }}
        severity={severity}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
export function openSnackBar(props) {
  SnackBar(props);
}
