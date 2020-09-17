import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField } from '../../MUI';
import { Select } from '../../Custom';
import styles from './FormDialog.module.css';

export default function CustomFormDialog(props) {
  const {
    open,
    title,
    description,
    buttons,
    fields,
    formik,
    onClose,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      maxWidth={'xs'}
      fullWidth
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <DialogContent>
            <DialogContentText>{description}</DialogContentText>
            {fields.map(field => (
              <>
                {field.isSelect ? (
                  <Select
                    options={field.options}
                    formik={formik}
                    namespace={field.namespace}
                    autoFocus
                    margin="dense"
                    label={field.label}
                    fullWidth
                    defaultValue={field.defaultValue}
                    className={styles.field}
                  />
                ) : (
                  <TextField
                    formik={formik}
                    namespace={field.namespace}
                    autoFocus
                    margin="dense"
                    id={field.id}
                    label={field.label}
                    type={field.type}
                    fullWidth
                    defaultValue={field.defaultValue}
                    disabled={field.disabled}
                    className={styles.field}
                    color={field.color}
                    variant={field.variant}
                  />
                )}
              </>
            ))}
          </DialogContent>
          <DialogActions>
            {buttons.map(button => (
              <Button
                onClick={button.onClick}
                color={button.color}
                type={button.type}
              >
                {button.name}
              </Button>
            ))}
          </DialogActions>
        </div>
      </form>
    </Dialog>
  );
}
