import React, { useEffect, useState } from 'react';

import { FormDialog } from '../../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import api from '../../../../../actions/api';
import { useFormik } from 'formik';
import { ERROR_ENUM } from '../../../../../../../common/errors';
import { formatRoute } from '../../../../../actions/goTo';
import { validateEmail } from '../../../../../utils/stringFormats';

export default function AddNonExistingPlayerEventRegistration(props) {
  const { open: openProps, name, onClose, onAdd } = props;
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const completeName = name.split(' ');
    formik.setFieldValue('name', completeName[0]);
    formik.setFieldValue('surname', completeName[1]);
  }, [name]);

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  const validateEmailisUnique = async email => {
    const { data } = await api(
      formatRoute('/api/entity/uniqueEmail', null, { email }),
    );
    return data;
  };
  const validate = async values => {
    const { name, surname, email } = values;
    const errors = {};
    if (!name) {
      errors.name = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!surname) {
      errors.surname = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!validateEmail(email)) {
      errors.email = t(ERROR_ENUM.INVALID_EMAIL);
    }
    if (!(await validateEmailisUnique(email))) {
      errors.email = t(ERROR_ENUM.EMAIL_ALREADY_EXIST);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      email: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { name, surname, email } = values;
      resetForm();
      onAdd({ name, surname, email });
      onClose();
    },
  });

  const buttons = [
    {
      onClick: onClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('add'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      type: 'text',
      namespace: 'name',
      label: t('name'),
    },
    {
      type: 'text',
      namespace: 'surname',
      label: t('surname'),
    },
    {
      type: 'text',
      namespace: 'email',
      label: t('email'),
    },
  ];

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={t('add_player_with_no_account')}
      fields={fields}
      formik={formik}
      buttons={buttons}
    ></FormDialog>
  );
}
