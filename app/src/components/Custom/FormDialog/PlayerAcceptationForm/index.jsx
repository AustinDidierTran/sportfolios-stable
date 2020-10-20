import React from 'react';
import BasicFormDialog from '../BasicFormDialog';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';

export default function PlayerAcceptationForm(props) {
  const { t } = useTranslation();
  const {
    open,
    onClose,
    title,
    description,
    onSubmit,
    personInfos,
  } = props;

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleDecline = () => {
    // eslint-disable-next-line
    console.log('Declining player');
    // do things
    handleClose();
  };

  const formik = useFormik({
    initialValues: {
      name: personInfos.name || '',
      surname: personInfos.surname || '',
      gender: personInfos.gender || '',
      birth_date: personInfos.birthDate || '',
      city: personInfos.city || '',
      zip: personInfos.zip || '',
    },
    validateOnChange: false,
    onSubmit: (values, { resetForm }) => {
      //const { email } = values;
      resetForm();
      // eslint-disable-next-line
      console.log('Accepting player');
      onSubmit();
    },
  });

  const fields = [
    {
      namespace: 'name',
      label: t('name'),
      type: 'text',
      disabled: true,
    },
    {
      namespace: 'surname',
      label: t('surname'),
      type: 'text',
      disabled: true,
    },
    {
      namespace: 'gender',
      label: t('gender'),
      type: 'text',
      disabled: true,
    },
    {
      namespace: 'birth_date',
      label: t('birth_date'),
      type: 'text',
      disabled: true,
    },
    {
      namespace: 'city',
      label: t('city'),
      type: 'text',
      disabled: true,
    },
    {
      namespace: 'zip',
      label: t('postal_code'),
      type: 'text',
      disabled: true,
    },
  ];

  const buttons = [
    {
      onClick: handleClose,
      name: t('cancel'),
      color: 'grey',
    },
    {
      type: 'submit',
      name: t('accept'),
      color: 'primary',
    },
    {
      onClick: handleDecline,
      name: t('decline'),
      color: 'secondary',
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
