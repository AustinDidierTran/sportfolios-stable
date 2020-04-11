import React, { useContext } from 'react';
import { useFormik } from 'formik';
import { TextField } from '../../../../components/MUI';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';

import Add from '@material-ui/icons/AddCircle';

import styles from './NewEmailField.module.css';
import { IconButton, Tooltip } from '@material-ui/core';
import { Store } from '../../../../Store';

export default function EmailField(props) {
  const {
    state: { authToken },
  } = useContext(Store);

  const { onSubmit } = props;
  const { t } = useTranslation();

  const validate = values => {
    const errors = {};

    if (!values.email) {
      errors.email = t('value_is_required');
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = t('invalid_email');
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { email } = values;

      const res = await api('/api/user/addEmail', {
        method: 'POST',
        body: JSON.stringify({
          authToken,
          email,
        }),
      });

      if (res.status === 200) {
        onSubmit();
      } else if (res.status === 403) {
        formik.setFieldError('email', t('email_already_used'));
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className={styles.container}>
        <TextField
          namespace="email"
          label={t('new_email')}
          fullWidth
          className={styles.TextField}
          formik={formik}
        />
        <Tooltip title="Add new email to your account">
          <IconButton size="small" type="submit">
            <Add size="small" />
          </IconButton>
        </Tooltip>
      </div>
    </form>
  );
}
