import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { ERROR_ENUM } from '../../../../../../common/errors';
import BasicFormDialog from '../BasicFormDialog';
import moment from 'moment';
import { validateEmail } from '../../../../utils/stringFormats';

export default function EditMemberImport(props) {
  const {
    open: openProps,
    onClose,
    updateMember,
    email,
    expirationDate,
  } = props;
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const validate = values => {
    const { expirationDate, email } = values;
    const errors = {};
    if (!expirationDate) {
      errors.expirationDate = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!email) {
      errors.email = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!validateEmail(email)) {
      errors.email = t(ERROR_ENUM.INVALID_EMAIL);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: email,
      expirationDate: expirationDate,
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { expirationDate, email } = values;
      const arr = expirationDate.split('-');
      updateMember(email, arr[2], arr[1], arr[0]);
      onClose();
    },
  });

  useEffect(() => {
    setOpen(openProps);
    formik.setFieldValue('email', email);
    formik.setFieldValue(
      'expirationDate',
      moment(expirationDate).format('YYYY-MM-DD'),
    );
  }, [openProps]);

  const fields = [
    {
      namespace: 'email',
      label: t('email'),
    },
    {
      namespace: 'expirationDate',
      label: t('expiration_date'),
      type: 'date',
      shrink: true,
    },
  ];

  const buttons = [
    {
      onClick: onClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('edit'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      open={open}
      title={t('edit_membership')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
