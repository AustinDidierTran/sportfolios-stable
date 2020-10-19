import React, { useMemo } from 'react';
import BasicFormDialog from '../BasicFormDialog';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { validateEmail } from '../../../../utils/stringFormats';
export default function EnterEmail(props) {
  const { t } = useTranslation();
  const { open, onClose, title, description, onSubmit } = props;

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const validate = values => {
    return validateEmail(values.email);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validate,
    validateOnChange: false,
    onSubmit: (values, { resetForm }) => {
      const { email } = values;
      resetForm();
      onSubmit(email);
    },
  });

  const isValidEmail = useMemo(() => validate(formik.values), [
    formik.values && formik.values.email,
  ]);

  const fields = [
    {
      namespace: 'email',
      label: t('email'),
      type: 'text',
    },
  ];

  const buttons = [
    {
      onClick: handleClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('add'),
      color: 'primary',
      disabled: !isValidEmail,
    },
  ];

  return (
    <BasicFormDialog
      open={open}
      title={title}
      fields={fields}
      formik={formik}
      onClose={onClose}
      buttons={buttons}
      description={description}
    />
  );
}
