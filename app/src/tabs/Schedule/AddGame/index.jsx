import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/Custom';
import styles from './AddGame.module.css';
import { useTranslation } from 'react-i18next';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AddGame(props) {
  const { t } = useTranslation();
  const { isOpen } = props;

  const [open, setOpen] = useState(open);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Game 1</DialogTitle>
      <DialogContent>
        <DialogContentText>Create your game here</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="phase"
          label="Phase"
          type="text"
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          id="field"
          label={t('field')}
          type="text"
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          id="time"
          type="time"
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          id="team 1"
          label={t('team_1')}
          type="text"
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          id="team 2"
          label={t('team_2')}
          type="text"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button
          className={styles.button}
          onClick={closeDialog}
          color="secondary"
          endIcon="Close"
        >
          Cancel
        </Button>
        <Button
          onClick={closeDialog}
          color="primary"
          endIcon="Check"
          className={styles.button}
        >
          Finish
        </Button>
      </DialogActions>
    </Dialog>
  );
}
