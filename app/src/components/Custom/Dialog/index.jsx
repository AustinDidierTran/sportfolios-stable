import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function CustomDialog(props) {
  const { open, title, description, buttons, onClose } = props;

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {buttons.map((button, index) => (
            <Button
              onClick={button.onClick}
              color={button.color || 'primary'}
              key={index}
            >
              {button.name}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export { default as AlertDialog } from './AlertDialog';
