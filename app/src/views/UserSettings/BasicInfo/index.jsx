import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Button, Card, CardContent, TextField, CardActions, Typography } from '../../../components/MUI';
import styles from './BasicInfo.module.css';

import { API_BASE_URL } from '../../../../../conf';
import { Store } from '../../../Store';
import { goTo, ROUTES } from '../../../actions/goTo';



export default function BasicInfo(props) {
  const { state: { authToken } } = useContext(Store);
  const { t } = useTranslation();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/auth/userInfo?authToken=${authToken}`).then((res) => res.json()).then(res => console.log('res', res))

  }, []);

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
      const res = await fetch(`${API_BASE_URL}/api/auth/changePassword?token=${authToken}`, {
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
        goTo(ROUTES.login);
      }

      if (res.status === 403) {
        // old password doesn't match
        formik.setFieldError('oldPassword', t('wrong_password'));
      }
    }
  })

  return (
    <Card className={styles.card}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">{t('basic_info')}</Typography>
      </CardContent>
    </Card>
  )
}