import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ComponentFactory } from '../../../Custom';
import { useTranslation } from 'react-i18next';
export default function BasicFormDialog(props) {
  const { t } = useTranslation();
  const defaultButtons = [
    {
      onClick: onClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('done'),
      color: 'primary',
    },
  ];

  const {
    open,
    title,
    description,
    buttons = defaultButtons,
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
      <form onSubmit={formik?.handleSubmit}>
        <div>
          <DialogContent>
            {description ? (
              <DialogContentText>{description}</DialogContentText>
            ) : (
              <></>
            )}
            {fields.map((field, index) => (
              <div style={{ marginTop: '8px' }} key={index}>
                <ComponentFactory component={{ ...field, formik }} />
              </div>
            ))}
          </DialogContent>
          <DialogActions>
            {buttons.map((button, index) => (
              <Button
                key={index}
                onClick={button.onClick}
                color={button.color}
                type={button.type}
                disabled={button.disabled}
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
