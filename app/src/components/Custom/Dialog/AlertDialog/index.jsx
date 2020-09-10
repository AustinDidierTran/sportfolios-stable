import React from 'react';
import CustomDialog from '..';
import { useTranslation } from 'react-i18next';
export default function AlertDialog(props) {
  const { t } = useTranslation();
  const {
    open,
    title = t('action_confirmation'),
    description = '',
    onSubmit,
    onCancel,
  } = props;

  const buttons = [
    {
      onClick: onCancel,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      onClick: onSubmit,
      type: 'submit',
      name: t('confirm'),
      color: 'primary',
    },
  ];

  return (
    <CustomDialog
      open={open}
      title={title}
      description={description}
      buttons={buttons}
      onClose={onCancel}
    />
  );
}
