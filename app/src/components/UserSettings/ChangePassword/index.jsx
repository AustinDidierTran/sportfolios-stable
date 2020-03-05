import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import Card from '../../MUI/Card';
import styles from './ChangePassword.module.css';
import { CardContent } from '@material-ui/core';
import Button from '../../MUI/Button'
import TextField from '../../MUI/TextField';
import { API_BASE_URL } from '../../../../../conf';
import { Store } from '../../../Store';
import history from '../../../stores/history';


export default function ChangePassword(props) {
  const { state: { authToken } } = useContext(Store);
  const { t } = useTranslation();

  const validate = values => {
    const errors = {};

    if (!values.oldPassword) {
      errors.oldPassword = t('value_is_required');
    } else if (values.oldPassword.length < 8 || values.oldPassword.length > 16) {
      errors.oldPassword = t('password_length');
    }

    if (!values.newPassword) {
      errors.newPassword = t('value_is_required');
    } else if (values.newPassword.length < 8 || values.newPassword.length > 16) {
      errors.newPassword = t('password_length');
    }

    if (!values.newPasswordConfirm) {
      errors.newPasswordConfirm = t('value_is_required');
    } else if (values.newPassword !== values.newPasswordConfirm) {
      errors.newPasswordConfirm = t('password_must_match');
    }
  }

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: ''
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { oldPassword, newPassword } = values;
      const res = await fetch(`${API_BASE_URL}/api/auth/changePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authToken, oldPassword, newPassword
        })
      });

      if (res.status === 402) {
        // Token is expired, redirect
        history.push('/login');
      }

      if (res.status === 403) {
        // old password doesn't match
        formik.setFieldError('oldPassword', t('wrong_password'));
      }
    }
  })


  return (
    <Card className={styles.card}>
      <form onSubmit={formik.handleSubmit}>

        <CardContent>
          <TextField
            id="oldPassword"
            name="oldPassword"
            placeholder={t('old_password')}
            type="password"
            onChange={formik.handleChange}
            fullWidth
            error={formik.errors.password}
            helperText={formik.errors.password}
          />
          <TextField
            id="newPassword"
            name="newPassword"
            placeholder={t('new_password')}
            type="password"
            onChange={formik.handleChange}
            fullWidth
            error={formik.errors.password}
            helperText={formik.errors.password}
          />
          <TextField
            id="newPasswordConfirm"
            name="newPasswordConfirm"
            placeholder={t('confirm_new_password')}
            type="password"
            onChange={formik.handleChange}
            fullWidth
            error={formik.errors.password}
            helperText={formik.errors.password}
          />
          <Button size="small"
            color="primary"
            variant="contained"
            className={styles.button}
            type="submit">
            {t('change_password')}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}