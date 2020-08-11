import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Button, TextField } from '../../../components/MUI';
import { Paper } from '../../../components/Custom';
import styles from './ChangePassword.module.css';

import { Store, ACTION_ENUM } from '../../../Store';
import api from '../../../actions/api';
import { goTo, ROUTES } from '../../../actions/goTo';

export default function ChangePassword() {
  const {
    state: { authToken },
    dispatch,
  } = useContext(Store);
  const { t } = useTranslation();

  const validate = values => {
    const errors = {};

    if (!values.oldPassword) {
      errors.oldPassword = t('value_is_required');
    } else if (
      values.oldPassword.length < 8 ||
      values.oldPassword.length > 24
    ) {
      errors.oldPassword = t('password_length');
    }

    if (!values.newPassword) {
      errors.newPassword = t('value_is_required');
    } else if (
      values.newPassword.length < 8 ||
      values.newPassword.length > 24
    ) {
      errors.newPassword = t('password_length');
    }

    if (!values.newPasswordConfirm) {
      errors.newPasswordConfirm = t('value_is_required');
    } else if (values.newPassword !== values.newPasswordConfirm) {
      errors.newPasswordConfirm = t('password_must_match');
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { oldPassword, newPassword } = values;
      const res = await api('/api/user/changePassword', {
        method: 'POST',
        body: JSON.stringify({
          authToken,
          oldPassword,
          newPassword,
        }),
      });

      if (res.status < 300) {
        resetForm();
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('password_changed'),
          severity: 'success',
        });
      } else if (res.status === 402) {
        // Token is expired, redirect
        goTo(ROUTES.login);
      } else if (res.status === 403) {
        // old password doesn't match
        formik.setFieldError('oldPassword', t('wrong_password'));
      }
    },
  });

  return (
    <Paper
      className={styles.card}
      childrenProps={{ className: styles.cardContent }}
    >
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <div className={styles.inputs}>
          <TextField
            formik={formik}
            namespace="oldPassword"
            label={t('old_password')}
            type="password"
            fullWidth
          />
          <TextField
            formik={formik}
            namespace="newPassword"
            label={t('new_password')}
            type="password"
            fullWidth
          />
          <TextField
            formik={formik}
            namespace="newPasswordConfirm"
            label={t('confirm_new_password')}
            type="password"
            fullWidth
          />
        </div>
        <div className={styles.buttons}>
          <Button
            size="small"
            color="primary"
            variant="contained"
            className={styles.button}
            type="submit"
            style={{ color: '#fff' }}
          >
            {t('change_password')}
          </Button>
        </div>
      </form>
    </Paper>
  );
}
