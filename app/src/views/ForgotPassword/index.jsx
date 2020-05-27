import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import styles from './Login.module.css';

import { ACTION_ENUM, Store } from '../../Store';
import { Container } from '../../components/Custom';
import api from '../../actions/api';
import { goTo, ROUTES } from '../../actions/goTo';
import ForgotPasswordCard from './ForgotPasswordCard';
import DescriptionCard from './DescriptionCard';

export default function Login() {
  const { dispatch } = useContext(Store);
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

    if (!values.password) {
      errors.password = t('value_is_required');
    } else if (
      values.password.length < 8 ||
      values.password.length > 16
    ) {
      errors.password = t('password_length');
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { email, password } = values;
      const res = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (res.status === 401) {
        // Email is not validated
        await api('/api/auth/sendConfirmationEmail', {
          method: 'POST',
          body: JSON.stringify({
            email,
          }),
        });
        formik.setFieldError('email', t('email_not_confirmed'));
      }

      if (res.status === 403) {
        // Password is not good
        formik.setFieldError(
          'password',
          t('email_password_no_match'),
        );
      }

      const { data } = await res.json();

      if (data) {
        const { token } = JSON.parse(data);
        dispatch({
          type: ACTION_ENUM.LOGIN,
          payload: token,
        });
        goTo(ROUTES.userSettings);
      }
    },
  });

  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <DescriptionCard />
        <ForgotPasswordCard />
      </Container>
    </div>
  );
}
